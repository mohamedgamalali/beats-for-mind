import { Router } from 'express';
import * as musicController from '../../controllers/admin/music';
import { body } from 'express-validator'
import isAuth from '../../helpers/isAuthAdmin'

const router = Router();

router.put('/catigory', [
    body('name')
    .not().isEmpty()
    .trim()
], isAuth, musicController.addCatigory);

router.post('/beet', [
    body('name')
    .not().isEmpty()
    .trim()
], isAuth, musicController.adddBeet);

router.get('/beats', isAuth, musicController.getBeets);

router.delete('/beat', [
    body('id')
    .not().isEmpty()
], isAuth, musicController.hideBeet);

//users


router.get('/users', isAuth, musicController.getUsers);

//send sms
router.post('/user/send/sms', [
    body('userId')
    .not().isEmpty(),
    body('message')
    .not().isEmpty()
], isAuth, musicController.sendSMS);

//user downloads 

router.post('/user/downloads', [
    body('userId')
    .not().isEmpty(),
    body('type')
    .not().isEmpty(),
    body('amount')
    .not().isEmpty()
], isAuth, musicController.userDownloads );


export default router;