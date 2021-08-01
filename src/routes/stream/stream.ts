import { Router } from 'express';
import * as streamer from '../../controllers/stream/stream';
import { body } from 'express-validator'

import isAuth from '../../helpers/isAuthUser'

const router = Router();

router.get('/audio/:fileName', streamer.streamAudio);

export default router;
