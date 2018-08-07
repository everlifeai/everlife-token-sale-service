const router = require('express').Router();
const awsService = require('../services/awsService');
const idmService = require('../services/idmService');

const bodyValidator = require('../middlewares/bodyValidator');
const storeKycDocsSchema = require('../validators/storeKycDocsSchema');

const accountRepository = require('../repository/accountRepository');

router.post('/uploadImg', awsService.uploadImage.fields([{ name: 'imgFile' }]), async (req, res, next) => {
    if (!req.files) {
        res.status(403).send("No images selected.");
    }
    const imgURL = req.files.imgFile[0].location;
    res.send({ url: imgURL });
});

router.post('/saveKycDocs', bodyValidator(storeKycDocsSchema), async (req, res, next) => {
    const { document1, document2 } = req.body;
    const userId = req.user.id;
    try {
        await accountRepository.storeKycDocs(userId, document1, document2)
    } catch(error) {
        next(error);
        return;
    }
    res.sendStatus(204);
});

router.post('/idmDecision', async (req, res, next) => {
    const userId = req.user.id;
    const { idmResponse, kycResult } = req.body;
    try {
        await idmService.verifySignature(idmResponse);
        await accountRepository.storeIDMStatus(userId, kycResult);
    } catch (error) {
        next(error);
        return;
    }
    res.sendStatus(204);
});

module.exports = router;