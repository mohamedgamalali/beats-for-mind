import { Router } from 'express';
import * as streamer from '../../controllers/stream/stream';
import { body } from 'express-validator'

import isAuth from '../../helpers/isAuthUserQ'
import isAuthH from '../../helpers/isAuthUser'

const router = Router();

router.get('/audio/uploads/:fileName' , isAuth, streamer.streamAudio);

router.get('/download/uploads/:fileName', isAuth, streamer.download);

router.get('/download/check', isAuthH, streamer.preDownload);


export default router;
 