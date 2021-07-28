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
Object.defineProperty(exports, "__esModule", { value: true });
class response {
    static CustomResponse(res, status, message, data, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: state,
                message: message,
                data: data
            };
            return res.status(status).json(Object.assign({}, response));
        });
    }
    //200 ok
    static ok(res, message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 1,
                message: message,
                data: data
            };
            return res.status(200).json(Object.assign({}, response));
        });
    }
    //201 created
    static created(res, message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 1,
                message: message,
                data: data
            };
            return res.status(201).json(Object.assign({}, response));
        });
    }
    //ERRORS
    //401 unauthrized state = 2
    static unauthorized(res, message = 'unauthrized', data = 'error') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 2,
                message: message,
                data: data
            };
            return res.status(401).json(Object.assign({}, response));
        });
    }
    //402 payment required state = 3
    static paymentRequired(res, message = 'payment required', data = 'error') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 3,
                message: message,
                data: data
            };
            return res.status(402).json(Object.assign({}, response));
        });
    }
    //403 Forbidden state = 4
    static Forbidden(res, message = 'Forbidden', data = 'error') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 4,
                message: message,
                data: data
            };
            return res.status(403).json(Object.assign({}, response));
        });
    }
    //404 notFound state = 5
    static NotFound(res, message = 'not Found', data = 'error') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 5,
                message: message,
                data: data
            };
            return res.status(404).json(Object.assign({}, response));
        });
    }
    //409 Conflict state = 8
    static Conflict(res, message = 'Conflict', data = 'error') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 8,
                message: message,
                data: data
            };
            return res.status(409).json(Object.assign({}, response));
        });
    }
    //415 Unsupported Media Type state = 6
    static UnsupportedMediaType(res, message = 'Unsupported Media Type', data = 'error') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 6,
                message: message,
                data: data
            };
            return res.status(415).json(Object.assign({}, response));
        });
    }
    //422 validation faild = 7
    static ValidationFaild(res, message = 'validation faild', data = 'error') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 7,
                message: message,
                data: data
            };
            return res.status(422).json(Object.assign({}, response));
        });
    }
    //server error state = 0
    static serverError(res, message, data = 'error') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                state: 0,
                message: message,
                data: data
            };
            return res.status(500).json(Object.assign({}, response));
        });
    }
}
exports.default = response;
