const userModel = require("../models/userModel");
const { Settings, validPlans } = require("../models/settingsModel");
const bcrypt = require("bcryptjs");

class UserService {
  async create(args) {
    const { name, email, password, plan, notificationsEnabled } = args;
    // Validation
    if (!password) {
      throw new Error("Password is required");
    }
    if (!validPlans.includes(plan)) {
        throw new Error(`Invalid plan. Valid plans are: ${validPlans.join(', ')}`);
    }
    if (typeof notificationsEnabled !== 'boolean') {
        throw new Error('notificationsEnabled must be a boolean');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      // Get the id of the settings configuration
      // or create one if it doesn't exist
      const [settings] = await Settings.findOrCreate({
        where: {
          plan,
          notificationsEnabled: notificationsEnabled,
        },
      });

      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        settingsId: settings.id,
      });

      return user;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(messages.join(", "));
      }
      throw error;
    }
  }

  async get() {
    return userModel.findAll({
        include: Settings,
    });
  }

  async getById(id) {
    return userModel.findByPk(id, {
        include: Settings,
    });
  }

  async update(id, args) {
    const { name, email, password, plan, notificationsEnabled } = args;

    // Validatinon
    if (plan && !validPlans.includes(plan)) {
        throw new Error(`Invalid plan. Valid plans are: ${validPlans.join(', ')}`);
    }
    if (notificationsEnabled !== undefined && typeof notificationsEnabled !== 'boolean') {
        throw new Error('notificationsEnabled must be a boolean');
    }

    const updateData = { name, email };

    if (plan && notificationsEnabled !== undefined) {
        const [settings] = await Settings.findOrCreate({
            where: {
                plan,
                notificationsEnabled: notificationsEnabled,
            },
        });
        updateData.settingsId = settings.id;
    }
        
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await userModel.update(updateData, { where: { id } });
    return this.getById(id);
  }

  async delete(id) {
    await userModel.destroy({ where: { id } });
    return `User ${id} was deleted successfully`;
  }
}

module.exports = UserService;
