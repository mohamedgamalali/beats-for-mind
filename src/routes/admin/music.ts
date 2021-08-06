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




export default router;