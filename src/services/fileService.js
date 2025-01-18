const filesModel = require('../models/fileModel');

class FileService {
    async create(name, size, type) {
        return filesModel.create({ name, size, type });
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

    async update(id, name) {
        const file = await this.getById(id);
        if (!file) {
            throw new Error(`File with id ${id} not found`);
        }
        const updated = { name };
        await filesModel.update({ name }, { where: { id } });
        return this.getById(id);
    }

    async delete(id) {
        const file = await this.getById(id);
        if (!file) {
            throw new Error(`File with id ${id} not found`);
        }
        await filesModel.destroy({ where: { id } });
        return `File ${id} was deleted successfully`;
    }

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
}

module.exports = new FileService();