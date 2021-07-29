import isAuth, { Token } from '../helpers/isAuth';
import { model } from 'mongoose'
import response from '../helpers/Response'
import { Response } from 'express'
import { compare } from 'bcryptjs';
import httpError from '../helpers/httpError';
import { body, check } from 'express-validator';
import {Request} from 'express'

export default class authServices extends isAuth {



    static async login(email: string, password: string, res: Response, DBmodel: string, privateKey: string, req:Request) {

        try {
            let find: object = { email: email };


            const User: any = model(DBmodel);

            
            const isEmail: number = email.indexOf("@");
            
            if (DBmodel == 'user') {
                if (isEmail !== -1) {
                    //find with email 
                    
                    await check('emailOrMobile')
                    .isEmail()
                    .normalizeEmail().run(req);

                    find = { 'local.email': req.body.emailOrMobile };
                    
                } else {
                    find = { 'mobile': email };
                }

            }


            //find user
            let user = await User.findOne(find);

            if (!user) {
                //regular error throw
                if (DBmodel == 'user') {
                    const ifFacebook = await User.findOne({ 'facebook.email': email })
                    if (ifFacebook) {
                        const error = new httpError(404, 9, 'user not found but have facebook account');
                        throw error;
                    }

                    const ifGoogle = await User.findOne({ 'google.email': email })
                    if (ifGoogle) {
                        const error = new httpError(404, 10, 'user not found but have google account');
                        throw error;
                    }
                }

                const error = new httpError(404, 5, 'user not found');
                throw error;
                //return response.NotFound(res, 'admin not found');
            }
            if (DBmodel == 'user') {
                const temp: any = user;
                user = {
                    ...temp.local,
                    _id: temp._id
                }
            }


            //compare pass
            const isEqual = await this.comparePassword(password, user.password);
            if (!isEqual) {
                //regular error throw
                const error = new httpError(401, 2, 'wrong password');
                throw error;
                //return response.unauthorized(res, 'wrong password')
            }

            const token: any = await this.generateJWT(user, privateKey);

            return token;

        } catch (err) {
            if (!err.status) {
                err.status = 500;
                err.state = 0;
            }
            throw err;
        }

    }

}