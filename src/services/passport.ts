import passport from 'passport';

import facebookStrategy, { Profile } from 'passport-facebook-token';

const googlePlusToken = require('passport-google-token').Strategy;

import { Request } from 'express'
import User from '../models/user';

import Auth from '../helpers/isAuth' ;

passport.use('facebookToken', new facebookStrategy({
    clientID:'1867797723379430',
    clientSecret: 'b96172449d8d29b95918ec9ace3844bf',
    passReqToCallback: true
}, async (req:Request, accessToken:any, refreshToken:any, profile:Profile, done) => {
    try {

        

        const result = await Auth.regesterSocialMedia(profile, 'facebook', req);
        return done(null, result);

    } catch (err) {
        done(err, false);
    }

}));

passport.use('googleToken', new googlePlusToken({
    clientID:'95840003083-846fert97pdnrbimt2g4jgak4v9trqfl.apps.googleusercontent.com',
    clientSecret: 'N_CrjLJwimFjZds-IDRiCU0n',
    passReqToCallback: true
}, async (req:Request, accessToken:any, refreshToken:any, profile:Profile, done:any) => {
    try {

        const result = await Auth.regesterSocialMedia(profile, 'google', req);
        return done(null, result);

    } catch (err) {
        done(err, false);
    }
    

}))

export default passport;