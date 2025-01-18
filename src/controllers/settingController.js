const GenericController = require('./genericController');

class settingController extends GenericController {
  constructor(service) {
    super(service);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async get(req, res) {
    try {
      const result = await this.service.get();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async changePlan(req, res) {
    try {
      const result = await this.service.changePlan(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateName(req, res) {
    try {
      const result = await this.service.updateName(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePassword(req, res) {
    try {
      const result = await this.service.updatePassword(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteAccount(req, res) {
    try {
      const result = await this.service.deleteAccount(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = settingController;
