import {Router} from 'express';
import * as authController from '../../controllers/user/auth' ;
import {body} from 'express-validator'
import passport from 'passport'

const router = Router();

router.put('/regester',[
    body('email')
    .isEmail()
    .withMessage('please enter a valid email.')
    .normalizeEmail(),
    body('password','enter a password with only number and text and at least 5 characters.')
    .isLength({min:5})
    .isAlphanumeric()
    .trim(),
    body('comfirmPassword')
    .trim()
    .custom((value,{req})=>{
        if(value!=req.body.password){
            return Promise.reject('password has to match');
        }
        return true ;
    }),
    body('first_name').not().isEmpty().trim(),
    body('last_name').not().isEmpty().trim(),
    body('mobile')
    .not().isEmpty()
    .trim()
], authController.regester) ;

export default router ;