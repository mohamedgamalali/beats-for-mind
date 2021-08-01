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

export async function streamAudio(req: Request, res: Response, next: NextFunction) {

    try {
        const filePath: string = req.params.fileName;

        const actualPath = path.join(__dirname, '/../../../uploads' , filePath);
        console.log(actualPath);
        
        const state      = fs.statSync(actualPath) ;
        res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': state.size
        });


        const readStream = fs.createReadStream(actualPath);

        readStream.pipe(res) ;

    } catch (err) {

        next(err);
    }
}