"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateMetaData = (totalDataLength, page, limit) => {
    return {
        page,
        limit,
        total: totalDataLength,
        totalPages: Math.ceil(totalDataLength / limit),
    };
};
exports.default = generateMetaData;
