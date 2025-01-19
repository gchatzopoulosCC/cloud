class SettingsController {
  constructor(service) {
    this.service = service;
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
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

  async getById(req, res) {
    try {
      const result = await this.service.getById(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.name === "NotFoundError") {
        return res.status(404).json({ message: "Not Found" });
      }
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = SettingsController;
