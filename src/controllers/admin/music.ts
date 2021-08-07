import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { validationResult } from 'express-validator'
import Catigory, { catigory } from '../../models/catigory';
import User, { user } from '../../models/user';
import Beet, { beet } from '../../models/beet';
import { Types } from 'mongoose';
import beetsData, { filesContainer } from '../../services/beetData';
import saveImage from '../../services/cloudenary';
import getData, { getBeet } from '../../services/getData';
import SMS from '../../services/sms';

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
        if (data.imageCover == '') {
            coverImagePath = data.image;
        } else {
            coverImagePath = data.imageCover;
        }

        const cat = await Catigory.findOne({ name: 'general' });
        if (!cat) {
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

        await newBeet.save();

        if (process.env.stage == 'test') {
            if (data.image !== '') {
                const saveToCloud = new saveImage(data.image);
                const newFileName = await saveToCloud.save();
                newBeet.image = newFileName.url;
                await newBeet.save();
            }
            if (data.audio !== '') {
                const saveToCloud = new saveImage(data.audio);
                const newFileName = await saveToCloud.save(true);
                newBeet.beet = newFileName.url;
                await newBeet.save();
            }
            if (data.imageCover !== '') {
                const saveToCloud = new saveImage(data.imageCover);
                const newFileName = await saveToCloud.save();
                newBeet.coverImage = newFileName.url;
                await newBeet.save();
            }
            if (data.imageCover == '') {
                newBeet.coverImage = newBeet.image;
                await newBeet.save();
            }
        }


        return response.created(res, 'catigory created', {
            beet: newBeet
        });

    } catch (err) {

        next(err);
    }
}

export async function getBeets(req: Request, res: Response, next: NextFunction) {

    try {
        const type: any = req.query.sort || 1;
        const page: any = req.query.page || 1;
        const catigory: any = req.query.catigory;
        const searchQ = req.query.searchQ || false;

        const get = new getData(page);

        const beets: getBeet = await get.Beets('home', type, searchQ, <Types.ObjectId>req.user, catigory);

        return response.ok(res, `beets sorted with ${beets.sortField}`, { ...beets })

    } catch (err) {
        console.log(err);

        next(err);
    }
}

export async function hideBeet(req: Request, res: Response, next: NextFunction) {

    try {
        const beatId: Types.ObjectId = req.body.id;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }

        const beat = await Beet.findById(beatId).select('hide')

        if (!beat) {
            return response.NotFound(res, 'beat not found');
        }

        beat.hide = true;

        await beat.save();

        return response.ok(res, 'beat deleted', {
            beat: beat
        })

    } catch (err) {
        console.log(err);

        next(err);
    }
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {

    try {
        const page = req.body.page || 1;

        const users = await User.find({})
            .select('-local.password')
            .skip((page - 1) * 10)
            .limit(10);
        
        const total = await User.find().countDocuments() ;

        return response.ok(res, 'users', {
            users:users,
            total:total
        });
        

    } catch (err) {
        console.log(err);

        next(err);
    }
}


export async function sendSMS(req: Request, res: Response, next: NextFunction) {

    try {
        const userId = req.body.userId ;
        const body   = req.body.message ;
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }

        const user = await User.findById(userId) ;

        if(user?.method !== 'local'){
            return response.Conflict(res, `can't send message to user with facebook or google account`)
        }
        
        
        const sms = new SMS(<string>process.env.TWILIO_ACCOUNT_SID, <string>process.env.TWILIO_AUTH_TOKEN)
       
        const result = await sms.send(body, <string>user?.mobile);

        return response.ok(res, 'message send', {message:{
            body:body,
            to:<string>user?.mobile
        }});
       
        

    } catch (err) {
        console.log(err);

        next(err);
    }
}