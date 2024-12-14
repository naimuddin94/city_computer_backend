"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppResponse {
    constructor(status, data, message, meta) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.meta = meta;
        this.success = status < 400;
        this.status = status;
        this.message = message;
        this.data = data;
        if (meta) {
            this.meta = meta;
        }
    }
}
exports.default = AppResponse;
