"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (obj, keys) => {
    const res = {};
    for (const key of keys) {
        if (key in obj) {
            res[key] = obj[key];
        }
    }
    return res;
};
exports.default = pick;
