import { Router } from 'express';
import * as musicController from '../../controllers/user/music';
import { body } from 'express-validator'
import passport from 'passport'

const router = Router();

router.get('/', musicController.getBeets);


export default router;
