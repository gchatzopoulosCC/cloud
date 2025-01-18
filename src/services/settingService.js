const settingsModel = require('./settingService');
const bcrypt = require('bcryptjs');

class SettingsService {
    async get() {
        return settingsModel.findAll();
    }

    async changePlan(id, plan) {
        await settingsModel.update({ plan }, { where: { id } });
        return this.getById(id);
    }

    async updateName(id, name) {
        await settingsModel.update({ name }, { where: { id } });
        return this.getById(id);
    }

    async updatePassword(id, password) {
        if (!password) {
            throw new Error('Password is required');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await settingsModel.update({ password: hashedPassword }, { where: { id } });
        return this.getById(id);
    }

    async deleteAccount(id) {
        await settingsModel.destroy({ where: { id } });
        return `Account ${id} was deleted successfully`;
    }
}

module.exports = new SettingsService();