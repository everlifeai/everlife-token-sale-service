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
    const { idmResponse } = req.body;
    try {
        const verifiedIdmResponse = await idmService.verifySignature(idmResponse);
        await accountRepository.storeIDMStatus(userId, verifiedIdmResponse.kyc_result);
        await accountRepository.storeIDMDetails(userId, JSON.stringify(verifiedIdmResponse));

    } catch (error) {
        console.log("[post:/idmDecision] Failed to verify JTW", error);
        next(error);
        return;
    }
    res.sendStatus(204);
});

router.get('/getUsers',  async (req, res, next) => {
    try {
        if (!req.user.isVerifier) {
            res.send(401);
            return;
        }
        const response = await accountRepository.getUserList();
        res.json(response);
    } catch (error) {
        next(error);
        return;
    }
});

router.post('/kycStatus', async (req, res, next) => {
  const userId = req.body.user_id;
  const kycStatus = req.body.kycStatus;
  try {
      if (!req.user.isVerifier) {
          res.send(401);
          return;
      }
      const response = await accountRepository.storeKycStatus(userId, kycStatus);
      res.json(response);
  } catch (error) {
      next(error);
  }
});


module.exports = router;
