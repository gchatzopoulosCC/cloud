const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: "minio",
  port: parseInt(process.env.MINIO_PORT || "9000", 10),
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

const bucketName = process.env.MINIO_BUCKET_NAME || "cloud-storage";
const region = process.env.MINIO_REGION || "eu-south-1";

// Create a bucket if it doesn't exist
const initializeMinio = async () => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, region);
      console.log(`Bucket '${bucketName}' created successfully.`);
    } else {
      console.log(`Bucket '${bucketName}' already exists.`);
    }
  } catch (error) {
    console.error(`Error checking or creating bucket ${bucketName}:`, error);
    throw error;
  }
};

module.exports = { minioClient, initializeMinio };
