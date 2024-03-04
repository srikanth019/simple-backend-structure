import {
  CLOUDINARY_CLOUD_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_CLOUD_SECRET,
} from "@/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_CLOUD_KEY,
  api_secret: CLOUDINARY_CLOUD_SECRET,
});

const uploadCloudinary = async (filePath: string) => {
  try {
    if (!filePath) return null;
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    await unlinkFile(filePath); // 2 Types of removing local files file
    return response?.url;
  } catch (error) {}
};

export { uploadCloudinary };
