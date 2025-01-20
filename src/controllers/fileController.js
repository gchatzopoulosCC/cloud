const GenericController = require("./genericController");
const { minioClient, bucketName } = require("../minio");

class FilesController extends GenericController {
  constructor(service) {
    super(service);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.upload = this.upload.bind(this);
    this.changeName = this.changeName.bind(this);
    this.delete = this.delete.bind(this);
    this.download = this.download.bind(this);
  }

  // TODO: Create a middleware to add constraints to the file name
  async upload(req, res) {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).send({
          message: "userId required!",
        });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).send({
          message: "File required!",
        });
      }
      const result = await this.service.upload(userId, file);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async changeName(req, res) {
    try {
      // Only updating the name of the file
      const { name } = req.body;
      // Check if the name is provided
      if (!name) {
        return res.status(400).send({
          message: "name required!",
        });
      }

      // Check if the file exists
      const file = await this.service.getById(req.params.id);
      if (!file) {
        return res.status(404).send({
          message: "File not found!",
        });
      }

      // Check if a file with the same name already exists
      const existingFile = await this.service.getByName(name);
      if (existingFile) {
        return res.status(400).send({
          message: "A file with the same name already exists!",
        });
      }
      const result = await this.service.changeName(req.params.id, name);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await this.service.delete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async download(req, res) {
    try {
      const { id } = req.params;

      // Check if the file exists
      const file = await this.service.getById(id);
      if (!file) {
        return res.status(404).send({
          message: "File not found!",
        });
      }

      // Check if the file exists in Minio
      let stat;
      try {
        stat = await minioClient.statObject(
          process.env.MINIO_BUCKET_NAME,
          file.path
        );
      } catch (error) {
        throw new Error(`File not found at path ${file.path}`);
      }

      // Set response headers
      const headers = {
        "Content-Type": "application/octet-stream",
        "Content-Length": stat.size,
        "Content-Disposition": `attachment; filename=${file.name}`,
      };
      res.set({ headers });

      // Pipe the file to the response
      const stream = await minioClient.getObject(bucketName, file.path);

      stream.pipe(res);
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }
}
module.exports = FilesController;
