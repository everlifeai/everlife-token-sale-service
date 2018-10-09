const express = require('express');
const router = express.Router();

const { UserError } = require('../errors/customErrors');
const authService = require('../services/authService');
const captcha = require('../services/captcha');

const authRepository = require('../repository/authRepository');
const accountRepo = require('../repository/accountRepository')

const bodyValidator = require('../middlewares/bodyValidator');
const userRegisterSchema = require('../validators/userRegisterSchema');
const userLoginSchema = require('../validators/userLoginSchema');

router.post('/register', bodyValidator(userRegisterSchema), async (req, res, next) => {
    const user = req.body;
    try {
        const captchaStatus = await captcha.isCaptchaSuccess(user.reCaptchaResponse);
        if(!captchaStatus){
            throw new UserError("Captcha invalid", 400);
        }
        const passwordHash = await authService.generatePasswordHash(user.password);
        user.password = passwordHash;
        await authRepository.createUser(user);

        var userDetails = await authRepository.getUser(user.email);
        var accessToken = await getAccessToken(userDetails);
    } catch (error) {
        next(error);
        return;
    }
    res.send({ accessToken, user: userDetails });
});

router.post('/login', bodyValidator(userLoginSchema), async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await authRepository.getUser(email);
        if (!user) {
            throw new UserError("User does not exist", 400);
        }
        if (await authService.comparePassword(password, user.password)) {
            const accessToken = await getAccessToken(user);
            const userProfile = await accountRepo.getUserProfile(user.id);
            const response = {
                user: userProfile,
                accessToken
            };
            res.send(response);
        }
        else {
            throw new UserError("Email or password do not match", 400);
        }
    } catch (error) {
        next(error);
    }
});

async function getAccessToken(user) {
    console.log('[getAccessToken]', user);
    const tokenData = {
        id: user._id,
        email: user.email,
        whitelist: user.whitelist,
        kyc: user.kyc,
        idmStatus: user.idmStatus,
        isAdmin: user.isAdmin,
        isVerifier: user.isVerifier
    };
    const token = await authService.generateAccessToken(tokenData);
    return token;
}

module.exports = router;
