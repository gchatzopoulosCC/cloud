const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

class UserService {
    async create(name, email, password) {
        if (!password) {
            throw new Error('Password is required');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            return userModel.create({ 
                name, 
                email, 
                password: hashedPassword 
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const messages = error.errors.map(err => err.message);
                throw new Error(messages.join(', '));
            }
            throw error;
        }
    }

    async get() {
        return userModel.findAll();
    }

    async getById(id) {
        return userModel.findByPk(id);
    }

    async update(id, name, email, password) {
        const updateData = {name, email}
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

    async getByEmail(email) {
        return userModel.findOne({ where: { email } });
    }
}

module.exports = new UserService();