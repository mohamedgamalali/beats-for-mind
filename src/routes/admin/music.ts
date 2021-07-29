import { Router } from 'express';
import * as musicController from '../../controllers/admin/music';
import { body } from 'express-validator'

const router = Router();

router.put('/catigory', [
    body('name')
    .not().isEmpty()
    .trim()
], musicController.addCatigory);

router.post('/beet', [
    body('name')
    .not().isEmpty()
    .trim(),
    body('catigoryId')
    .not().isEmpty()
    .trim(),
], musicController.adddBeet);




export default router;