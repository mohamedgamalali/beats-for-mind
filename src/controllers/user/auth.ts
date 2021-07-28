import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import Auth, { Token } from '../../helpers/isAuth'
import { validationResult } from 'express-validator'

const mobileValidator = require('validate-phone-number-node-js')

export async function regester(req: Request, res: Response, next: NextFunction) {

    try {

        const first_name: string = req.body.first_name;
        const last_name: string = req.body.last_name;
        const mobile: string = req.body.mobile;
        const email: string = req.body.email;
        const password: string = req.body.password

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }

        const validMobile = mobileValidator.validate(mobile);

        if (!validMobile) {
            return response.ValidationFaild(res, 'validation faild for mobile', errors.array())
        }

        const result = await Auth.registerLocal(email, password, first_name, last_name, mobile);

        return response.created(res, `account created with local method`, result);


    } catch (err) {

        next(err);
    }
}