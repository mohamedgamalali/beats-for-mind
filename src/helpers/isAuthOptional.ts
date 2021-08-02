
import { Request, Response, NextFunction} from 'express';
import isAuth from './isAuth'

export default async function(req:Request, res:Response, next:NextFunction){
    try{
        await isAuth.optionalAuth(req, res, next);
        next();
    }
    catch(err){
        next(err);
    }
}