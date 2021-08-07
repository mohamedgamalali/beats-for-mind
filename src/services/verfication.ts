import { Types } from "mongoose";
import User, { user } from "../models/user";
import crypto from 'crypto';
import { compare, hash } from 'bcryptjs'
import httpError from '../helpers/httpError';

export default class verify {
    private userId: Types.ObjectId;

    constructor(userId: Types.ObjectId) {
        this.userId = userId;
    }

    async generateCode() {
        try {

            const user = await User.findById(this.userId);

            const code = crypto.randomBytes(3).toString('hex');

            const hashedCode = await hash(code, 12);

            if (user) {
                user.verficationCode = hashedCode;
                user.codeExpireDate = Date.now() + 900000;
                await user.save();
            }

            const message = `[beats for mind] your verifivation code is ${code}`;
            
            let email: string|null = ' ' ;

            switch(user?.method){
                case 'local':
                    email = user?.local?.email ;
                    break ;
                case 'facebook':
                    email = user?.facebook?.email ;
                    break ;
                case 'google':
                    email = user?.google?.email ;
                    break ;
            }

            return { message, mobile: user?.mobile, email:email};


        } catch (err) {
            throw err;
        }
    }

    async check(code: string) {
        try {

            const user = await User.findById(this.userId).select('verficationCode codeExpireDate verfied');


            const hashedCode = await compare(code, <string>user?.verficationCode);

            if (!hashedCode) {
                const err = new httpError(403, 5, 'invalid code')
                throw err;
            }

            if (<number>user?.codeExpireDate <= Date.now()) {
                const err = new httpError(403, 5, 'token expired')
                throw err;
            }

            if (user) {
                user.verfied = true;
                await user.save();
            }

            return true;


        } catch (err) {
            throw err;
        }
    }
}