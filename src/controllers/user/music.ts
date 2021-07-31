import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { query, validationResult } from 'express-validator'
import authServices from '../../services/auth'
import Beet, { beet } from '../../models/beet';
import getData, {getBeet} from '../../services/getData'
import { Types } from 'mongoose';

export async function getBeets(req: Request, res: Response, next: NextFunction) {

    try {

        const type:any = req.query.sort || 1 ;
        const page:any = req.query.page || 1 ;
        const catigory:any  = req.query.catigory  ;
        const tap:any  = req.query.tap || 'home' ;       //home || fev || downloads

        const get = new getData(page);

        const beets:getBeet = await get.Beets(tap,type, <Types.ObjectId> req.user ,catigory);

        return response.ok(res, `beets sorted with ${beets.sortField}`, {...beets})

        

    } catch (err) {

        next(err);
    }
}
