import { Buffer } from "buffer";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const fileUploadOnCloudinary = async (
  fileBuffer: Buffer
): Promise<string | null> => {
  try {
    // Use a Promise to handle the upload process
    return new Promise((resolve, reject) => {
      // Upload the file buffer to Cloudinary
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) {
            reject(error); // Reject the Promise if there's an error
          } else if (result) {
            resolve(result.secure_url); // Resolve the Promise with the URL if successful
          } else {
            reject(new Error("Upload failed: result is undefined"));
          }
        })
        .end(fileBuffer);
    });
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};

export default fileUploadOnCloudinary;
