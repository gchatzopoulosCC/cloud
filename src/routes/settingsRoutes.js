const SettingsService = require('../services/settingsService');
const service = new SettingsService();
const SettingsController = require('../controllers/settingsController');
const settingsController = new SettingsController(service);

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get all settings
 *     responses:
 *       '200':
 *         description: List of settings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Settings'
 * /settings/{id}:
 *   get:
 *     summary: Get a setting by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID of the setting
 *     responses:
 *       '200':
 *          description: Setting details
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Settings'
 *       '404':
 *          description: Setting not found
 *   delete:
 *     summary: Delete a setting by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID of the setting
 *     responses:
 *       '204':
 *          description: Setting deleted
 *       '403':
 *          description: Forbidden
 *       '404':
 *          description: Setting not found
 */
router.get('/', settingsController.get);
router.get('/:id', settingsController.getById);
router.delete('/:id', settingsController.delete);

module.exports = router;