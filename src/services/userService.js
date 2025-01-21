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
      throw new Error(
        `Invalid plan. Valid plans are: ${validPlans.join(", ")}`
      );
    }
    if (typeof notificationsEnabled !== "boolean") {
      throw new Error("notificationsEnabled must be a boolean");
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
    let {
      name = null,
      email = null,
      password = null,
      plan = null,
      notificationsEnabled = null,
    } = args;

    // Validatinon
    if (plan && !validPlans.includes(plan)) {
      throw new Error(
        `Invalid plan. Valid plans are: ${validPlans.join(", ")}`
      );
    }
    if (
      notificationsEnabled !== null &&
      typeof notificationsEnabled !== "boolean"
    ) {
      throw new Error("notificationsEnabled must be a boolean");
    }

    const user = await this.getById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    let updateData = {};

    if (name) {
      updateData.name = name;
    } else {
      updateData.name = user.name;
    }

    if (email) {
      updateData.email = email;
    } else {
      updateData.email = user.email;
    }

    if (plan || notificationsEnabled) {
      const settings = await Settings.findByPk(user.settingsId);
      plan ? (plan = plan) : (plan = settings.plan);
      notificationsEnabled
        ? (notificationsEnabled = notificationsEnabled)
        : (notificationsEnabled = settings.notificationsEnabled);
      const [newSettings] = await Settings.findOrCreate({
        where: {
          plan,
          notificationsEnabled: notificationsEnabled,
        },
      });
      updateData.settingsId = newSettings.id;
    } else {
      updateData.settingsId = user.settingsId;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    } else {
      updateData.password = user.password;
    }
    console.log(updateData);

    await userModel.update(updateData, { where: { id } });
    return this.getById(id);
  }

  async delete(id) {
    return await userModel.destroy({ where: { id } });
  }
}

module.exports = new UserService();
