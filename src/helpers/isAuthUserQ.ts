
import { Request, Response, NextFunction} from 'express';
import isAuth from '../helpers/isAuth'

export default async function(req:Request, res:Response, next:NextFunction){
    try{
        console.log('hh');
        
        await isAuth.IsAuthrizedUser(req, res, next, true);
    }
    catch(err){
        next(err);
    }
}