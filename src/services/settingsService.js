const { Settings } = require("../models/settingsModel");

class SettingsService {
  async get() {
    return Settings.findAll();
  }

  async getById(id) {
    return Settings.findByPk(id);
  }

  async delete(id) {
    return Settings.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = SettingsService;
