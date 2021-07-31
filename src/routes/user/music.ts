import { Router } from 'express';
import * as musicController from '../../controllers/user/music';
import { body } from 'express-validator'

import isAuth from '../../helpers/isAuthUser'

const router = Router();

router.get('/', musicController.getBeets);

router.put('/favourits', [
    body('beetId')
    .not().isEmpty(),
],isAuth , musicController.postFav)

router.get('/search', isAuth, musicController.search)

export default router;
