import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { validationResult } from 'express-validator'
import Catigory, { catigory } from '../../models/catigory';
import Beet, { beet } from '../../models/beet';
import { Types } from 'mongoose';
import beetsData, { filesContainer } from '../../services/beetData';
import saveImage from '../../services/cloudenary';
import path from 'path';
import fs from 'fs';
const audioConverter = require('audio-converter');

export async function streamAudio(req: Request, res: Response, next: NextFunction) {

    try {
        const filePath: string = req.params.fileName;

        const actualPath = path.join(__dirname, '/../../../uploads', filePath);


        const state = fs.statSync(actualPath);
        res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': state.size
        });

        res.download(actualPath)

        const readStream = fs.createReadStream(actualPath);

        readStream.pipe(res);

    } catch (err) {

        next(err);
    }
}

export async function download(req: Request, res: Response, next: NextFunction) {

    try {
        // const filePath: string = req.params.fileName;

        // const actualPath = path.join(__dirname, '/../../../uploads', filePath);


        // const file = await ffmpeg().input(actualPath).outputFormat('wav').save('file.wav');

        // console.log(file);


        // // ffmpeg(actualPath).toFormat('wav').on('error', err => {
        // //     throw err;
        // // }).on('progress', progress => {
        // //     console.log(JSON.stringify(progress));
        // //     console.log('Processing: ' + progress.targetSize + ' KB converted');
        // // }).on('end', () => {
        // //     console.log('Processing finished !');
        // // }).save('./filePath.wav');


        // const state = fs.statSync(path.join(__dirname, filePath));
        // console.log(state);


        // res.download(path.join(__dirname, './', filePath));


        // const ffmpeg = require('fluent-ffmpeg');

        const filePath: string = req.params.fileName;

        const actualPath = path.join(__dirname, '/../../../uploads', filePath);

        audioConverter()
     
    } catch (err) {

        next(err);
    }
}