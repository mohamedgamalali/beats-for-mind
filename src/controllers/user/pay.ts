import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import httpError from '../../helpers/httpError'
import { query, validationResult } from 'express-validator'
import { Types } from 'mongoose';
import Pay, {beforePay} from '../../services/pay'
import User from '../../models/user' ;
export async function getPlans(req: Request, res: Response, next: NextFunction) {

    try {

        let gotOneTimePlan:boolean|undefined = false ;
        const plans = await beforePay.createPlans() ;
        if(req.user){
            const user = await User.findById(req.user).select('gotOneTimePlan')
            gotOneTimePlan = user?.gotOneTimePlan ;
        }
        return response.ok(res, 'planes', {
            plans:plans,
            gotOneTimePlan:gotOneTimePlan
        });

    } catch (err) {

        next(err);
    }
}

export async function subscripe(req: Request, res: Response, next: NextFunction) {

    try {

        const token = req.body.token ;
        const plan  = req.body.plan ;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }

        const pay = new Pay(<Types.ObjectId>req.user, token, plan) ;

        const subscription = await pay.subscripe() ;

        return response.created(res, `user subscriped in plan ${plan}`, {
            subscription_status: subscription.status
        });



    } catch (err) {

        next(err);
    }
}