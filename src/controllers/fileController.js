const fs = require('fs');
const path = require('path');
const GenericController = require('./genericController');

class FilesController extends GenericController{
    constructor(service) {
        super(service);
        this.get = this.get.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.download = this.download.bind(this);
    }

    async create(req, res) {
        try {
            const { name, size, type } = req.body;
            const result = await this.service.create(name, size, type);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            // Only updating the name of the file           
            const { name } = req.body;
            const result = await this.service.update(req.params.id, name);
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
            const file = await this.service.download(id);

            const filePath = path.resolve(file.filePath);
            if (!fs.existsSync(filePath)) {
                return res.status(404).send({
                    message: `File not found at path ${filePath}`
                });
            }

            res.download(filePath, file.fileName, (err) => {
                if (err) {
                    res.status(500).send({
                        message: `Could not download the file. ${err}`
                    });
                }
            });
        } catch (error) {
            res.status(404).send({
                message: error.message
            });
        }
    }
}
module.exports = FilesController;