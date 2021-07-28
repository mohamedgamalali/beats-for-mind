"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("../../controllers/user/auth"));
const express_validator_1 = require("express-validator");
const router = express_1.Router();
router.put('/regester', [
    express_validator_1.body('email')
        .isEmail()
        .withMessage('please enter a valid email.')
        .normalizeEmail(),
    express_validator_1.body('password', 'enter a password with only number and text and at least 5 characters.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    express_validator_1.body('comfirmPassword')
        .trim()
        .custom((value, { req }) => {
        if (value != req.body.password) {
            return Promise.reject('password has to match');
        }
        return true;
    }),
    express_validator_1.body('first_name').not().isEmpty().trim(),
    express_validator_1.body('last_name').not().isEmpty().trim(),
    express_validator_1.body('mobile')
        .not().isEmpty()
        .trim()
], authController.regester);
exports.default = router;
