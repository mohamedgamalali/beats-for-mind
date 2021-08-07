import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import Auth, { Token } from '../../helpers/isAuth'
import { validationResult } from 'express-validator'
import authServices from '../../services/auth'
import SMS from '../../services/sms'
import Verify from '../../services/verfication'
import {Types} from 'mongoose'

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

export async function facebookAuth(req: Request, res: Response, next: NextFunction) {

    try {

        const token = await Auth.generateJWT(req.user, <string>process.env.JWT_PRIVATE_KEY_USER);

        return response.ok(res, 'OK', { 
            token: token, 
            user: req.user 
        });

    } catch (err) {

        next(err);
    }
}

export async function googleAuth(req: Request, res: Response, next: NextFunction) {

    try {

        const token = await Auth.generateJWT(req.user, <string>process.env.JWT_PRIVATE_KEY_USER);

        return response.ok(res, 'OK', { 
            token: token, 
            user: req.user 
        });

    } catch (err) {

        next(err);
    }
}

export async function localLogin(req: Request, res: Response, next: NextFunction) {

    try {

        const emailOrMobile = req.body.emailOrMobile;
        const password     = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }


        const token:Token = await authServices.login(emailOrMobile, password, res, 'user', <string>process.env.JWT_PRIVATE_KEY_USER, req)

        return response.ok(
            res,
             'logged in successfully',
             {...token});

    } catch (err) {

        next(err);
    }
}

//verfication
export async function send(req: Request, res: Response, next: NextFunction) {

    try {

        const method = req.body.method ;
        let message;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }


        if(method== 'email'){
            
        }else if(method == 'mobile'){
            const sms = new SMS(<string>process.env.TWILIO_ACCOUNT_SID, <string>process.env.TWILIO_AUTH_TOKEN)
            
            const verify = new Verify(<Types.ObjectId>req.user)

            const codeGenerator = await verify.generateCode()

            // const result = await sms.send(codeGenerator.message, <string>codeGenerator.mobile);
            message = codeGenerator.message ;
        }

        return response.ok(res, 'code sent to clien', {
            method:method,
            code:message
        });

    } catch (err) {

        next(err);
    }
}

export async function check(req: Request, res: Response, next: NextFunction) {

    try {

        const code = req.body.code ;
        let message;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }


        const verify = new Verify(<Types.ObjectId>req.user)

        const checker = await verify.check(code);

        return response.ok(res, 'ok',{
            result:checker
        });


    } catch (err) {

        next(err);
    }
}