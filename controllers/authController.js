const express = require('express');
const router = express.Router();

const { UserError } = require('../errors/customErrors');
const authService = require('./../services/authService');

const authRepository = require('../repository/authRepository');

const bodyValidator = require('../middlewares/bodyValidator');
const userRegisterSchema = require('../validators/userRegisterSchema');
const userLoginSchema = require('../validators/userLoginSchema');

router.post('/register', bodyValidator(userRegisterSchema), async (req, res, next) => {
    const user = req.body;
    try {
        const passwordHash = await authService.generatePasswordHash(user.password);
        user.password = passwordHash;
        await authRepository.createUser(user);

        const userDetails = await authRepository.getUser(user.email);
        var accessToken = await getAccessToken(userDetails);
    } catch (error) {
        next(error);
        return;
    }
    res.send({ accessToken });
});

router.post('/login', bodyValidator(userLoginSchema), async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await authRepository.getUser(email);
        if (!user) {
            next(new UserError("User does not exist"));
            return;
        }
        if (await authService.comparePassword(password, user.password)) {
            try {
                var accessToken = await getAccessToken(user);
            } catch (error) {
                next(error);
            }
            const response = {
                user: {
                    name: user.name,
                    email: user.email,
                    kyc: user.kyc,
                    whitelist: user.whitelist,
                    ca: user.ca,
                },
                accessToken
            }
            res.send(response);
        }
        else {
            res.status(401).send({ "error": "Email or password do not match" });
        }
    } catch (error) {
        next(error);
        return;
    }

});

async function getAccessToken(user) {
    const tokenData = {
        id: user._id,
        email: user.email,
        whitelist: user.whitelist,
        kyc: user.kyc,
    }
    const token = await authService.generateAccessToken(tokenData);
    return token;
}

module.exports = router;