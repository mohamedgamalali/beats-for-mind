import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import httpError from '../../helpers/httpError'
import { query, validationResult } from 'express-validator'
import authServices from '../../services/auth'
import Beet, { beet } from '../../models/beet';
import getData, { getBeet } from '../../services/getData'
import { Types } from 'mongoose';
import Fev from '../../models/fev';

export async function getBeets(req: Request, res: Response, next: NextFunction) {

    try {

        const type: any = req.query.sort || 1;
        const page: any = req.query.page || 1;
        const catigory: any = req.query.catigory;
        const tap: any = req.query.tap || 'home';       //home || fev || downloads
        const searchQ  = req.query.searchQ || false;

        const get = new getData(page);

        const beets: getBeet = await get.Beets(tap, type, searchQ, <Types.ObjectId>req.user, catigory);

        return response.ok(res, `beets sorted with ${beets.sortField}`, { ...beets })



    } catch (err) {

        next(err);
    }
}

export async function postFav(req: Request, res: Response, next: NextFunction) {

    try {
        const id: any = req.body.beetId;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }

        const item = await Beet.findById(id);

        if (!item) {
            return response.NotFound(res, 'beet not found', item)
        }

        const fevItem = await Fev.findOne({ user: req.user, beet: item._id });

        if (fevItem) {
            const err = new httpError(409, 50, 'already added to fev')
            throw err;
        }


        const newFev = new Fev({
            user: req.user,
            beet: item._id
        });

        await newFev.save();

        return response.created(res, 'added', newFev);


    } catch (err) {

        next(err);
    }
}

