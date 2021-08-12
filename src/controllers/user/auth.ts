import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import Auth, { Token } from '../../helpers/isAuth'
import { validationResult } from 'express-validator'
import authServices from '../../services/auth'
import SMS from '../../services/sms'
import EMAIL from '../../services/email'
import Verify from '../../services/verfication'
import { Types } from 'mongoose'
import User, { user } from "../../models/user";
import { beforePay } from '../../services/pay';
import  Downloads from '../../services/downloadsHandler';

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

        //
        const user = result.user;

        let checkPlan = false;
        if (user?.plan) {
            checkPlan = await beforePay.checkSubscription(user?.plan.subscription_id)
        }
        //

        const d = new Downloads(user);

        const countDownloads = await d.countDownloads();


        let date = {
            plan: checkPlan,
            verify: user?.verfied,
            downloadsPerDay: countDownloads.perDay,
            freeDownloads: countDownloads.freeDownloads
        }

        return response.created(res, `account created with local method`, {
            ...result.token,
            ...date
        });


    } catch (err) {

        next(err);
    }
}

export async function facebookAuth(req: Request, res: Response, next: NextFunction) {

    try {

        const token = await Auth.generateJWT(req.user, <string>process.env.JWT_PRIVATE_KEY_USER);
        const user = await User.findById(req.user);

        let checkPlan = false;
        if (user?.plan) {
            checkPlan = await beforePay.checkSubscription(user?.plan.subscription_id)
        }
        //


        const d = new Downloads(<user>user);

        const countDownloads = await d.countDownloads();


        let data = {
            plan: checkPlan,
            verify: user?.verfied,
            downloadsPerDay: countDownloads.perDay,
            freeDownloads: countDownloads.freeDownloads
        }

        return response.ok(res, 'OK', {
            token: {
                ...token,
                ...data
            },
            user: req.user
        });

    } catch (err) {

        next(err);
    }
}

export async function googleAuth(req: Request, res: Response, next: NextFunction) {

    try {

        const token = await Auth.generateJWT(req.user, <string>process.env.JWT_PRIVATE_KEY_USER);

        const user = await User.findById(req.user);

        let checkPlan = false;
        if (user?.plan) {
            checkPlan = await beforePay.checkSubscription(user?.plan.subscription_id)
        }
        //

        const d = new Downloads(<user>user);

        const countDownloads = await d.countDownloads();


        let data = {
            plan: checkPlan,
            verify: user?.verfied,
            downloadsPerDay: countDownloads.perDay,
            freeDownloads: countDownloads.freeDownloads
        }
        return response.ok(res, 'OK', {
            token: {
                ...token,
                ...data
            },
            user: req.user
        });

    } catch (err) {

        next(err);
    }
}

export async function localLogin(req: Request, res: Response, next: NextFunction) {

    try {

        const emailOrMobile = req.body.emailOrMobile;
        const password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }


        const token: Token = await authServices.login(emailOrMobile, password, res, 'user', <string>process.env.JWT_PRIVATE_KEY_USER, req)

        const user = await User.findOne({ 'local.email': token.email });

        let checkPlan = false;
        if (user?.plan) {
            checkPlan = await beforePay.checkSubscription(user?.plan.subscription_id)
        }
        //


        const d = new Downloads(<user>user);

        const countDownloads = await d.countDownloads();


        let data = {
            plan: checkPlan,
            verify: user?.verfied,
            downloadsPerDay: countDownloads.perDay,
            freeDownloads: countDownloads.freeDownloads
        }

        return response.ok(
            res,
            'logged in successfully',
            {
                ...token,
                ...data
            });

    } catch (err) {

        next(err);
    }
}

//verfication
export async function send(req: Request, res: Response, next: NextFunction) {

    try {

        const method = req.body.method;
        let message;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }


        if (method == 'email') {

        } else if (method == 'mobile') {
            const sms = new SMS(<string>process.env.TWILIO_ACCOUNT_SID, <string>process.env.TWILIO_AUTH_TOKEN)

            const verify = new Verify(<Types.ObjectId>req.user)

            const codeGenerator = await verify.generateCode()

            // const result = await sms.send(codeGenerator.message, <string>codeGenerator.mobile);
            message = codeGenerator.message;
        }

        return response.ok(res, 'code sent to clien', {
            method: method,
            code: message
        });

    } catch (err) {

        next(err);
    }
}

export async function check(req: Request, res: Response, next: NextFunction) {

    try {

        const code = req.body.code;
        let message;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }


        const verify = new Verify(<Types.ObjectId>req.user)

        const checker = await verify.check(code);

        return response.ok(res, 'ok', {
            result: checker
        });


    } catch (err) {

        next(err);
    }
}

export async function forgetPassword(req: Request, res: Response, next: NextFunction) {

    try {

        const email = new EMAIL(<string> process.env.CLIENT_ID, <string> process.env.CLIENT_SECRET, <string> process.env.REFRESH_TOKEN, <string> process.env.EMAIL)
        await email.send('jdjdjd');

        return response.ok(res, 'code send', {
            code:'code'
        });

    } catch (err) {

        next(err);
    }
}