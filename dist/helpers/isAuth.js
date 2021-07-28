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
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const httpError_1 = __importDefault(require("./httpError"));
const user_1 = __importDefault(require("../models/user"));
class Auth {
    static hashedPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.hash(password, 12);
        });
    }
    static comparePassword(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.compare(password, hashedPassword);
        });
    }
    static generateJWT(user, privateKye) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                token: jsonwebtoken_1.sign({
                    email: user.email,
                    id: user._id.toString(),
                }, privateKye, { expiresIn: '3h' }),
                expiresIn: 10000000,
                email: user.email
            };
        });
    }
    static getToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.get('Authorization');
                if (!authHeader) {
                    //regular error throw
                    const error = new httpError_1.default(401, 2, 'missed JWT header');
                    throw error;
                }
                return authHeader.split(' ')[1];
            }
            catch (err) {
                throw err;
            }
        });
    }
    static verifyToken(token, privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = yield jsonwebtoken_1.verify(token, privateKey);
                if (!decodedToken) {
                    //regular error throw
                    const error = new httpError_1.default(401, 2, 'not authrized');
                    throw error;
                }
                return decodedToken;
            }
            catch (err) {
                //regular error throw
                const error = new httpError_1.default(401, 2, err.message);
                throw error;
            }
        });
    }
    //user
    static checkForRegesteredEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFacebook = yield user_1.default.findOne({ 'facebook.email': email });
                const userGoogle = yield user_1.default.findOne({ 'google.email': email });
                const userLocal = yield user_1.default.findOne({ 'local.email': email });
                if (userFacebook || userGoogle || userLocal) {
                    const error = new httpError_1.default(409, 8, 'email allready regestered try login');
                    throw error;
                }
                return false;
            }
            catch (err) {
                if (!err.status) {
                    err.status = 500;
                    err.state = 0;
                }
                throw err;
            }
        });
    }
    static checkForRegesteredMobile(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFacebook = yield user_1.default.findOne({ mobile: mobile });
                if (userFacebook) {
                    const error = new httpError_1.default(409, 8, 'mobile allready regestered try login');
                    throw error;
                }
                return false;
            }
            catch (err) {
                if (!err.status) {
                    err.status = 500;
                    err.state = 0;
                }
                throw err;
            }
        });
    }
    static registerLocal(email, password, first_name, last_name, mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //values come here after validation for:-
                //mobile 'valid mobile'
                //email 'valid normalized email'
                //password 'valida pass'
                const emailRegesterd = yield this.checkForRegesteredEmail(email);
                if (emailRegesterd) {
                    const error = new httpError_1.default(409, 8, 'email allready regestered try login');
                    throw error;
                }
                const mobileRegesterd = yield this.checkForRegesteredMobile(mobile);
                if (mobileRegesterd) {
                    const error = new httpError_1.default(409, 8, 'mobile allready regestered try login');
                    throw error;
                }
                const hasedPass = yield this.hashedPassword(password);
                const newUser = new user_1.default({
                    method: 'local',
                    local: {
                        email: email,
                        password: hasedPass,
                        first_name: first_name,
                        last_name: last_name,
                    },
                    mobile: mobile,
                });
                const user = yield newUser.save();
                const token = yield this.generateJWT({
                    _id: user._id,
                    email: user.local.email
                }, process.env.JWT_PRIVATE_KEY_USER);
                return token;
            }
            catch (err) {
                if (!err.status) {
                    err.status = 500;
                    err.state = 0;
                }
                throw err;
            }
        });
    }
    static regesterSocialMedia(profile, method, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //this method works for social media "facebook, google" with merging accounts, login or regestration
                if (method == 'facebook') {
                    const user = yield user_1.default.findOne({ 'facebook.id': profile.id }).select('local google facebook mobile');
                    if (user) {
                        req.user = {
                            _id: user._id,
                            email: user.facebook.email
                        };
                        return user;
                    }
                    const ifUserLocal = yield user_1.default.findOne({ 'local.email': profile.emails[0].value }).select('-blocked -local.password');
                    if (ifUserLocal) {
                        req.user = {
                            _id: ifUserLocal._id,
                            email: ifUserLocal.local.email
                        };
                        return ifUserLocal;
                    }
                    const ifUserGoogle = yield user_1.default.findOne({ 'google.email': profile.emails[0].value }).select('local google facebook mobile');
                    if (ifUserGoogle) {
                        req.user = {
                            _id: ifUserGoogle._id,
                            email: ifUserGoogle.google.email
                        };
                        return ifUserGoogle;
                    }
                    const newUser = new user_1.default({
                        method: 'facebook',
                        facebook: {
                            id: profile.id,
                            email: profile.emails[0].value,
                            name: profile.displayName,
                            photo: profile.photos[0].value
                        }
                    });
                    const newClientFacebook = yield newUser.save();
                    req.user = {
                        _id: newClientFacebook._id,
                        email: newClientFacebook.facebook.email
                    };
                    return newClientFacebook;
                }
                else if (method == 'google') {
                    const user = yield user_1.default.findOne({ 'google.id': profile.id }).select('blocked method local google facebook mobile');
                    if (user) {
                        req.user = {
                            _id: user._id,
                            email: user.google.email
                        };
                        return user;
                    }
                    const ifUserLocal = yield user_1.default.findOne({ 'local.email': profile.emails[0].value }).select('-blocked -local.password');
                    if (ifUserLocal) {
                        req.user = {
                            _id: ifUserLocal._id,
                            email: ifUserLocal.local.email
                        };
                        return ifUserLocal;
                    }
                    const ifUserFacebook = yield user_1.default.findOne({ 'facebook.email': profile.emails[0].value }).select('blocked method local google facebook mobile');
                    if (ifUserFacebook) {
                        req.user = {
                            _id: ifUserFacebook._id,
                            email: ifUserFacebook.facebook.email
                        };
                        return ifUserFacebook;
                    }
                    const newUser = new user_1.default({
                        method: 'google',
                        google: {
                            id: profile.id,
                            email: profile.emails[0].value,
                            name: profile.displayName,
                            photo: profile.photos[0].value
                        }
                    });
                    const newClientGoogle = yield newUser.save();
                    req.user = {
                        _id: newClientGoogle._id,
                        email: newClientGoogle.google.email
                    };
                    return newClientGoogle;
                }
            }
            catch (err) {
                if (!err.status) {
                    err.status = 500;
                    err.state = 0;
                }
                throw err;
            }
        });
    }
    static IsAuthrizedUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //get token
                const token = yield this.getToken(req);
                //decode token
                const decodedToken = yield this.verifyToken(token, process.env.JWT_PRIVATE_KEY_USER);
                //check for admin
                const user = yield user_1.default.findById(decodedToken.id);
                if (!user) {
                    //regular error throw
                    const error = new httpError_1.default(404, 2, 'user not found');
                    throw error;
                }
                if (user.blocked == true) {
                    //regular error throw
                    const error = new httpError_1.default(403, 4, 'user blocked');
                    throw error;
                }
                req.user = decodedToken.id;
                next();
            }
            catch (err) {
                next(err);
            }
        });
    }
    static optionalAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //get token
                const authHeader = req.get('Authorization');
                if (!authHeader) {
                    return false;
                }
                const token = authHeader.split(' ')[1];
                const decodedToken = yield jsonwebtoken_1.verify(token, process.env.JWT_PRIVATE_KEY_USER);
                if (!decodedToken) {
                    return false;
                }
                const user = yield user_1.default.findById(decodedToken.id);
                if (!user) {
                    return false;
                }
                req.user = decodedToken.id;
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = Auth;
