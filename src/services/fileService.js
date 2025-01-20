const filesModel = require('../models/fileModel');
const fs = require('fs');
const path = require('path');
const { minioClient } = require('../minio');

class FileService {
    async upload(userId, file) {
        const bucketName = process.env.MINIO_BUCKET_NAME || 'cloud-storage';

        try {
            let fileName = file.originalname;
            // Create a path for the file
            let filePath = `${userId}/${fileName}`;
            // Get the file size, type, and stream
            const fileSize = file.size;
            const fileType = path.extname(fileName);
            const fileStream = fs.createReadStream(file.path);

            // Check if the file exists in the bucket
            let exists;
            try {
                exists = await minioClient.statObject(bucketName, filePath);
            } catch (error) {
                exists = false;
            }

            // If the file exists, add a timestamp to the file name
            if (exists) {
                // Remove the extension from the file name
                const parts = fileName.split('.');
                const name = parts[0];
                // Add a timestamp to the file name
                fileName = `${name}(${Date.now()})${fileType}`;
                // Update the path
                filePath = `${userId}/${fileName}`;
            }

            await minioClient.putObject(bucketName, filePath, fileStream, fileSize);
            
            // Save file info to database
            const fileData = {
                name: fileName,
                size: fileSize,
                fileType: fileType,
                path: filePath,
                userId: userId
            };
            
            const savedFile = await filesModel.create(fileData);
            return savedFile;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file. Please try again.');
        }
    }

    async get() {
        return filesModel.findAll();
    }

    async getById(id) {
        const file = await filesModel.findByPk(id);
        if (!file) {
            throw new Error(`File with id ${id} not found`);
        }
        return file;
    }

    async getByName(name) {
        return await filesModel.findOne({ where: { name } });
    }

    async changeName(id, name) {
        const file = await this.getById(id);
        if (!file) {
            throw new Error(`File with id ${id} not found`);
        }

        // Update the file name and path
        const oldPath = file.path;
        const newPath = oldPath.replace(file.name, name);
        console.log(`Old path: ${oldPath} \nNew path: ${newPath}`);

        const updateData = {
            name: name,
            path: newPath
        };
        await filesModel.update(updateData, { where: { id } });

        // Rename the file in Minio
        await this.renameFileInStorage(oldPath, newPath);
        return this.getById(id);
    }

    // TODO: Use minioClient to delete the file
    async delete(id) {
        const file = await this.getById(id);
        if (!file) {
            throw new Error(`File with id ${id} not found`);
        }
        await filesModel.destroy({ where: { id } });
        return `File ${id} was deleted successfully`;
    }

    // TODO: Use minioClient to download the file
    async download(id) {
        const file = await this.getById(id);
        if (!file) {
            throw new Error(`File with id ${id} not found`);
        }

        const filePath = path.resolve(file.path); 
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path ${filePath}`);
        }

        return {
            fileName: file.name,
            filePath: filePath
        };
    }

    // Helpers
    async renameFileInStorage(oldPath, newPath) {
        const bucketName = process.env.MINIO_BUCKET_NAME || 'cloud-storage';
        try {
            await minioClient.copyObject(
                bucketName, 
                newPath, 
                `/${bucketName}/${oldPath}`);
            await minioClient.removeObject(
                bucketName, 
                oldPath);
            console.log(`File renamed from ${oldPath} to ${newPath}`);
        } catch (error) {
            console.error('Error renaming file:', error);
            throw new Error('Failed to rename file. Please try again.');
        }
    }
}

module.exports = FileService;