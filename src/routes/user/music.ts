import { Router } from 'express';
import * as musicController from '../../controllers/user/music';
import { body } from 'express-validator'

import isAuth from '../../helpers/isAuthUser'

const router = Router();

router.get('/',isAuth , musicController.getBeets);


export default router;
