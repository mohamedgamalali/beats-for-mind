import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { validationResult } from 'express-validator'
import Catigory, { catigory } from '../../models/catigory';
import Beet, { beet } from '../../models/beet';
import { Types } from 'mongoose';
import beetsData, { filesContainer } from '../../services/beetData';

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
        if(data.coverImage == ''){
            coverImagePath = data.image ;
        }else{
            coverImagePath = data.coverImage ;
        }

        const cat = await Catigory.findById(catigory)
        if(!cat){
            return response.NotFound(res, 'catigory not found')
        }
        const newBeet = new Beet({
            name: name,
            image: data.image,
            coverImage: coverImagePath,
            beet: data.audio,
            catigory: Types.ObjectId
        })

        await newBeet.save() ;


        return response.created(res, 'catigory created', {
            beet:newBeet
        });

    } catch (err) {

        next(err);
    }
}