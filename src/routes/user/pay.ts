import { Router } from 'express';
import * as payController from '../../controllers/user/pay';
import { body } from 'express-validator'

import isAuth from '../../helpers/isAuthUser'
import isAuthOptional from '../../helpers/isAuthOptional'

const router = Router();


router.get('/plans', isAuthOptional,payController.getPlans);

router.post('/subscription', [
    body('token')
    .not().isEmpty(),
    body('plan')
    .not().isEmpty(),
],isAuth, payController.subscripe);



export default router;
