import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  url: string;
}

const upload_file = (file: string, folder: string): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder: folder,
      },
      (error, result: any) => {
        if (error) return reject(error);
        resolve({
          public_id: result.public_id,
          url: result.secure_url || result.url, // secure_url is recommended
        });
      }
    );
  });
};

const delete_file = async (file: string): Promise<boolean> => {
  const res = await cloudinary.v2.uploader.destroy(file);
  return res?.result === "ok";
};

export { upload_file, delete_file, cloudinary };
