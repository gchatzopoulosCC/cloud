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

  async update(id, { name, email, plan, notificationsEnabled }) {
    const user = await this.getById(id);

    const updateData = {
      name: name || user.name,
      email: email || user.email,
    };

    if (plan !== undefined || notificationsEnabled !== undefined) {
      const settings = await Settings.findByPk(user.settingsId);
      const updatedSettings = {
        plan: plan !== undefined ? plan : settings.plan,
        notificationsEnabled:
          notificationsEnabled !== undefined
            ? notificationsEnabled
            : settings.notificationsEnabled,
      };

      const [newSettings] = await Settings.findOrCreate({
        where: updatedSettings,
      });

      updateData.settingsId = newSettings.id;
    }

    await user.update(updateData);
  }

  async updatePassword(id, { oldPassword, newPassword }) {
    const user = await this.getById(id);
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.update({ password: hashedPassword }, { where: { id } });
  }

  async updateEmail(id, { oldEmail, email }) {
    const user = await this.getById(id);
    if (user.email !== oldEmail) {
      throw new Error("Invalid old email");
    }
    await userModel.update({ email }, { where: { id } });
  }

  async delete(id) {
    return await userModel.destroy({ where: { id } });
  }
}

module.exports = new UserService();
