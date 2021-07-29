import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { validationResult } from 'express-validator'
import Catigory, { catigory } from '../../models/catigory';
import Beet, { beet } from '../../models/beet';
import { Types } from 'mongoose';


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

        console.log(req.files);
        

        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return response.ValidationFaild(res, 'validation faild', errors.array())
        // }

        // if (images.length == 0) {
        //     return response.ValidationFaild(res, 'you should at least insert one image')
        // }

        // imagePath = images[0].path;

        // if (!images[1]) {
        //     coverImagePath = imagePath;
        // } else {
        //     coverImagePath = images[1].path;
        // }

        // const cat = await Catigory.findById(catigory);

        // if (!cat) {
        //     return response.NotFound(res, 'catigory not found');
        // }

        // const newBeet = new Beet({
        //     name: name,
        //     image: imagePath,
        //     coverImage: coverImagePath,
        //     beet: ,
        //     duration: string,
        //     hide: boolean,
        //     catigory: Types.ObjectId


        // })


        return response.created(res, 'catigory created', 'data');

    } catch (err) {

        next(err);
    }
}