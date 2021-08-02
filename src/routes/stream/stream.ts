import { Router } from 'express';
import * as streamer from '../../controllers/stream/stream';
import { body } from 'express-validator'

import isAuth from '../../helpers/isAuthUserQ'

const router = Router();

router.get('/audio/uploads/:fileName' , streamer.streamAudio);

router.get('/download/uploads/:fileName', streamer.download);


export default router;
 