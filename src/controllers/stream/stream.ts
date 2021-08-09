import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { validationResult } from 'express-validator'
import Catigory, { catigory } from '../../models/catigory';
import Beet, { beet } from '../../models/beet';
import Down, { download } from '../../models/downloads';
import User, { user } from '../../models/user';
import { Types } from 'mongoose';
import beetsData, { filesContainer } from '../../services/beetData';
import saveImage from '../../services/cloudenary';
import path from 'path';
import fs, { read } from 'fs';
import http from 'http';
import downloadHandler from '../../services/downloadsHandler';
const got = require('got');
const audioConverter = require('audio-converter');
const zlib = require('zlib');

export async function streamAudio(req: Request, res: Response, next: NextFunction) {

    try {



        const id: any = req.params.fileName;
        let actualPath: string;

        const beetItem = await Beet.findById(id);

        if (!beetItem) {
            return response.NotFound(res, 'beat not found');
        }

        if (req.user) {
            if (beetItem?.beet.includes('http')) { // cloudinary url

                actualPath = beetItem.beet;
                beetItem.plays = beetItem.plays + 1;
                await beetItem.save()
                got.stream(actualPath).pipe(res);
            }
            else {
                actualPath = path.join(__dirname, '/../../../', <string>beetItem?.beet);
                const state = fs.statSync(actualPath);
                beetItem.plays = beetItem.plays + 1;
                await beetItem.save()
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': state.size
                });

                const readStream = fs.createReadStream(actualPath);

                readStream.pipe(res);

            }
        }



    } catch (err) {

        next(err);
    }
}

export async function preDownload(req: Request, res: Response, next: NextFunction) {

    try {


        const user = await User.findById(req.user)

        const D = new downloadHandler(<user>user);
        const count = await D.countDownloads();

        if (!(count.freeDownloads > 0 && count.perDay > 0)) {
            return response.Forbidden(res, `can't download, no more downloads today or free beats`)
        }

        return response.ok(res, 'user can download', count)



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

        const user = await User.findById(req.user);


        if (beetItem?.beet.includes('http')) {
            //cloudinary url
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

                    const D = new downloadHandler(<user>user);
                    await D.onDownload(beetItem._id);

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
                const D = new downloadHandler(<user>user);
                await D.onDownload(beetItem._id);
                res.download(path.join(__dirname, '/../../../', `${beetItem?.name}.gz`))
            })

        }

    } catch (err) {

        next(err);
    }
}