const GenericController = require('./genericController');

class UserController extends GenericController{
    constructor(service) {
        super(service);
        // this.bindMethods(['get', 'getById', 'create', 'update', 'delete', 'getByEmail']);
        this.get = this.get.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getByEmail = this.getByEmail.bind(this);
    }

    bindMethods(methods) {
        methods.forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    async create(req, res) {
        try {
            const { name, email, password } = req.body;
            const result = await this.service.create(name, email, password);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { name, email, password } = req.body;
            const result = await this.service.update(req.params.id, name, email, password);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getByEmail(req, res) {
        try {
            const result = await this.service.getByEmail(req.params.email);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;