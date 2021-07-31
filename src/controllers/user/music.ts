import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { query, validationResult } from 'express-validator'
import authServices from '../../services/auth'
import Beet, { beet } from '../../models/beet';
import getData from '../../services/getData'

export async function getBeets(req: Request, res: Response, next: NextFunction) {

    try {

        const type:any = req.query.type || 1 ;
        const page:any = req.query.page || 1 ;
        const catigory = req.query.catigory  ;

        const get = new getData(page);

        const beets = await get.Beets(type);

        return response.ok(res, `beets sorted with ${beets}`, {...beets})

        

    } catch (err) {

        next(err);
    }
}
