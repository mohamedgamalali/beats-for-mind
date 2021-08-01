import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { validationResult } from 'express-validator'
import Catigory, { catigory } from '../../models/catigory';
import Beet, { beet } from '../../models/beet';
import { Types } from 'mongoose';
import beetsData, { filesContainer } from '../../services/beetData';
import saveImage from '../../services/cloudenary' ;

export async function addCatigory(req: Request, res: Response, next: NextFunction) {

    try {
        const name: string = req.body.name;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }

        const newCat = new Catigory({
            name: name
        });

        await newCat.save();

        return response.created(res, 'catigory created', newCat);

    } catch (err) {

        next(err);
    }
}

export async function adddBeet(req: Request, res: Response, next: NextFunction) {

    try {
        const name: string = req.body.name;
        const catigory: Types.ObjectId = req.body.catigoryId;
        const images: any = req.files;
        let imagePath: string;
        let coverImagePath: string;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }

        if (images.length == 0) {
            return response.ValidationFaild(res, 'you should at least insert one file')
        }


        const data: filesContainer = await beetsData.files(images)

        if (data.audio == '') {
            return response.ValidationFaild(res, 'you should insert audio')
        }

        if (data.image == '') {
            return response.ValidationFaild(res, 'you should at least insert beet image')
        }
        if(data.imageCover == ''){
            coverImagePath = data.image ;
        }else{
            coverImagePath = data.imageCover ;
        }

        const cat = await Catigory.findById(catigory)
        if(!cat){
            return response.NotFound(res, 'catigory not found')
        }
        console.log(coverImagePath);
        console.log(data);

        const newBeet = new Beet({
            name: name,
            image: data.image,
            coverImage: coverImagePath,
            beet: data.audio,
            catigory: cat?._id
        })
        
        await newBeet.save() ;

        if(process.env.stage == 'test'){
            if(data.image!==''){
                const saveToCloud = new saveImage(data.image);
                const newFileName = await saveToCloud.save() ;
                newBeet.image = newFileName.url;
                await newBeet.save() ;
            }
            if(data.audio!==''){
                const saveToCloud = new saveImage(data.audio);
                const newFileName = await saveToCloud.save() ;
                newBeet.beet = newFileName.url;
                await newBeet.save() ;
            }
            if(data.imageCover!==''){
                const saveToCloud = new saveImage(data.imageCover);
                const newFileName = await saveToCloud.save() ;
                newBeet.coverImage = newFileName.url;
                await newBeet.save() ;
            }
            if(data.imageCover == ''){
                newBeet.coverImage = newBeet.image ;
                await newBeet.save() ;
            }
        }


        return response.created(res, 'catigory created', {
            beet:newBeet
        });

    } catch (err) {

        next(err);
    }
}