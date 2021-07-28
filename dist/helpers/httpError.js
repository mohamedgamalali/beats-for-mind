"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class httpError {
    constructor(status, state, message) {
        this.status = status;
        this.state = state;
        this.message = message;
    }
}
exports.default = httpError;
