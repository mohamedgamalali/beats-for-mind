"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = __importDefault(require("./Response"));
function default_1(error, req, res, next) {
    const status = error.status || 500;
    const state = error.state || 0;
    const message = error.message || 'somesing went wrong';
    if (status === 500) {
        Response_1.default.serverError(res, message);
    }
    else {
        Response_1.default.CustomResponse(res, status, message, 'error', state);
    }
}
exports.default = default_1;
