import { Router } from 'express';
import * as authController from '../../controllers/user/auth';
import { body } from 'express-validator'
import passport from 'passport'
import isAuthVerify from '../../helpers/isAuthVerify';
const router = Router();

router.put('/regester', [
    body('email')
        .isEmail()
        .withMessage('please enter a valid email.')
        .normalizeEmail(),
    body('password', 'enter a password with only number and text and at least 5 characters.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body('comfirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value != req.body.password) {
                return Promise.reject('password has to match');
            }
            return true;
        }),
    body('first_name').not().isEmpty().trim(),
    body('last_name').not().isEmpty().trim(),
    body('mobile')
        .not().isEmpty()
        .trim()
], authController.regester);

router.put('/regester/facebook', passport.authenticate('facebookToken', { session: false }), authController.facebookAuth)

router.put('/regester/google', passport.authenticate('googleToken', { session: false }), authController.googleAuth)

router.post('/login', [
    body('emailOrMobile')
        .not().isEmpty().trim(),
    body('password', 'enter a password with only number and text and at least 5 characters.')
        .isLength({ min: 5 })
        .trim(),
], authController.localLogin)


//verify

router.post('/verify/send', [
    body('method')
        .not().isEmpty(),
],isAuthVerify , authController.send)

router.post('/verify/check', [
    body('code')
        .not().isEmpty(),
],isAuthVerify , authController.check)


export default router;