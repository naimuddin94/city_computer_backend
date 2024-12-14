"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
const fileUploadOnCloudinary = async (fileBuffer) => {
    try {
        // Use a Promise to handle the upload process
        return new Promise((resolve, reject) => {
            // Upload the file buffer to Cloudinary
            cloudinary_1.v2.uploader
                .upload_stream({ resource_type: "auto" }, (error, result) => {
                if (error) {
                    reject(error); // Reject the Promise if there's an error
                }
                else if (result) {
                    resolve(result.secure_url); // Resolve the Promise with the URL if successful
                }
                else {
                    reject(new Error("Upload failed: result is undefined"));
                }
            })
                .end(fileBuffer);
        });
    }
    catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        return null;
    }
};
exports.default = fileUploadOnCloudinary;
