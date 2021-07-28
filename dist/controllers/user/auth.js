"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regester = void 0;
const Response_1 = __importDefault(require("../../helpers/Response"));
const isAuth_1 = __importDefault(require("../../helpers/isAuth"));
const express_validator_1 = require("express-validator");
const mobileValidator = require('validate-phone-number-node-js');
function regester(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const first_name = req.body.first_name;
            const last_name = req.body.last_name;
            const mobile = req.body.mobile;
            const email = req.body.email;
            const password = req.body.password;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return Response_1.default.ValidationFaild(res, 'validation faild', errors.array());
            }
            const validMobile = mobileValidator.validate(mobile);
            if (!validMobile) {
                return Response_1.default.ValidationFaild(res, 'validation faild for mobile', errors.array());
            }
            const result = yield isAuth_1.default.registerLocal(email, password, first_name, last_name, mobile);
            return Response_1.default.created(res, `account created with local method`, result);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.regester = regester;
