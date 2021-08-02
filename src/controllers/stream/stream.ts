import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { validationResult } from 'express-validator'
import Catigory, { catigory } from '../../models/catigory';
import Beet, { beet } from '../../models/beet';
import Down, { download } from '../../models/downloads';
import { Types } from 'mongoose';
import beetsData, { filesContainer } from '../../services/beetData';
import saveImage from '../../services/cloudenary';
import path from 'path';
import fs from 'fs';
import http from 'http';
const got = require('got');
const audioConverter = require('audio-converter');
import isAuth from '../../helpers/isAuthUserQ'
const zlib = require('zlib');

export async function streamAudio(req: Request, res: Response, next: NextFunction) {

    try {

        // try {
        //     await isAuth(req, res, next);

        // } catch (err) {
        //     throw err;
        // }

        const id: any = req.params.fileName;
        let actualPath: string;

        const beetItem = await Beet.findById(id);



        if (!beetItem) {
            return response.NotFound(res, 'beat not found');
        }


        if (beetItem?.beet.includes('http')) { // cloudinary url
            actualPath = beetItem.beet;
            beetItem.plays = beetItem.plays + 1;
            await beetItem.save()
            got.stream(actualPath).pipe(res);
        } else {
            actualPath = path.join(__dirname, '/../../../', <string>beetItem?.beet);
            const state = fs.statSync(actualPath);
            beetItem.plays = beetItem.plays + 1;
            await beetItem.save()
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': state.size
            });

            // res.download(actualPath)

            const readStream = fs.createReadStream(actualPath);

            readStream.pipe(res);
        }






    } catch (err) {

        next(err);
    }
}

export async function download(req: Request, res: Response, next: NextFunction) {

    try {
        const id: any = req.params.fileName;
        let actualPath: string;

        const beetItem: any = await Beet.findById(id);



        if (!beetItem) {
            return response.NotFound(res, 'beat not found');
        }


        if (beetItem?.beet.includes('http')) { // cloudinary url
            actualPath = beetItem.beet;
            beetItem.downloads = beetItem.downloads + 1;
            await beetItem.save()
            const file = fs.createWriteStream('file.mp3');
            http.get(actualPath, function (response: any) {
                response.pipe(file);

            });
            file.on('finish', async (r: any) => {

                const downloadedFile = path.join(__dirname, '/../../../', 'file.mp3')
                var zip = zlib.createGzip();

                var read = fs.createReadStream(downloadedFile);
                var write = fs.createWriteStream(`${beetItem?.name}.gz`);

                //Transform stream which is zipping the input file
                read.pipe(zip).pipe(write);
                write.on('finish', async (DDD: any) => {
                    const d = await Down.findOne({ beet: beetItem._id })
                    if (!d) {
                        const newDown = new Down({
                            user: "6106ce368400d50015d87e28",
                            beet: beetItem._id
                        })
                        await newDown.save();
                    }

                    res.download(path.join(__dirname, '/../../../', `${beetItem?.name}.gz`))
                })
            })

        } else {
            actualPath = path.join(__dirname, '/../../../', <string>beetItem?.beet);
            const state = fs.statSync(actualPath);
            beetItem.downloads = beetItem.downloads + 1;
            await beetItem.save()

            var zip = zlib.createGzip();

            var read = fs.createReadStream(actualPath);
            var write = fs.createWriteStream(`${beetItem?.name}.gz`);
            //Transform stream which is zipping the input file
            read.pipe(zip).pipe(write);
            write.on('finish', async (DDD: any) => {
                const d = await Down.findOne({ beet: beetItem._id })
                    if (!d) {
                        const newDown = new Down({
                            user: "6106ce368400d50015d87e28",
                            beet: beetItem._id
                        })
                        await newDown.save();
                    }
                res.download(path.join(__dirname, '/../../../', `${beetItem?.name}.gz`))
            })

            // const readStream = fs.createReadStream(actualPath);

            // readStream.pipe(res);
        }

    } catch (err) {

        next(err);
    }
}