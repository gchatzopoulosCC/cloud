const GenericController = require("./genericController");

const { validPlans } = require("../models/settingsModel");

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

class UserController extends GenericController {
  constructor(service) {
    super(service);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
  }

  async create(req, res) {
    try {
      const { email } = req.body;
      // Validate email
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }

      // Validate plan
      const { plan } = req.body;
      if (!validPlans.includes(plan)) {
        return res.status(400).json({ message: "Invalid plan" });
      }

      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { email } = req.body;
      // Validate email
      if (email && !validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }

      await this.service.update(req.params.id, req.body);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePassword(req, res) {
    try {
      await this.service.updatePassword(req.params.id, req.body);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateEmail(req, res) {
    try {
      const { email } = req.body;
      // Validate email
      if (email && !validateEmail(email)) {
        return res.status(400).json({ message: "Invalid new email" });
      }

      await this.service.updateEmail(req.params.id, req.body);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
