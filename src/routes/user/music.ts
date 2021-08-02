import { Router } from 'express';
import * as musicController from '../../controllers/user/music';
import { body } from 'express-validator'

import isAuth from '../../helpers/isAuthUserQ'
import isAuthOptional from '../../helpers/isAuthOptional'

const router = Router();

router.get('/', isAuthOptional ,musicController.getBeets);

router.put('/favourits', [
    body('beetId')
    .not().isEmpty(),
],isAuth , musicController.postFav)


export default router;
