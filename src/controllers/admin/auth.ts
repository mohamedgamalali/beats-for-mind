import { Request, Response, NextFunction } from 'express';
import response from '../../helpers/Response'
import { validationResult } from 'express-validator'
import authServices from '../../services/auth'


export async function login(req: Request, res: Response, next: NextFunction) {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.ValidationFaild(res, 'validation faild', errors.array())
        }


        const token = await authServices.login(email, password, res, 'admin', <string>process.env.JWT_PRIVATE_KEY_ADMIN, req)

        return response.ok(
            res,
             'logged in successfully',
             {...token});

    } catch (err) {

        next(err);
    }
}
