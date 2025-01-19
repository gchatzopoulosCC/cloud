const UserService = require("../services/userService");
const service = new UserService();
const UserController = require("../controllers/userController");
const userController = new UserController(service);

const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /user:
 *  get:
 *    summary: Get all users
 *    responses:
 *      '200':
 *        description: List of users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *  post:
 *    summary: Create a new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserCreate'
 *    responses:
 *      '201':
 *        description: User created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      '400':
 *        description: Validation error
 *  /{id}:
 *    get:
 *      summary: Get a user by ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: ID of the user
 *      responses:
 *        '200':
 *          description: User details
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        '404':
 *          description: User not found
 *  put:
 *    summary: Update a user by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID of the user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserUpdate'
 *    responses:
 *      '200':
 *        description: User updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: User not found
 *  delete:
 *    summary: Delete a user by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID of the user
 *    responses:
 *      '200':
 *        description: User deleted
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: User not found
 *components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        name:
 *          type: string
 *          example: John Doe
 *        email:
 *          type: string
 *          example: john.doe@example.com
 *    UserCreate:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *      properties:
 *        name:
 *          type: string
 *          example: John Doe
 *        email:
 *          type: string
 *          example: john.doe@example.com
 *        password:
 *          type: string
 *          example: password123
 *        plan:
 *          type: string
 *          example: free
 *        notificationsEnabled:
 *          type: string
 *          example true
 *    UserUpdate:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          example: John Doe
 *        email:
 *          type: string
 *          example: john.doe@example.com
 *        password:
 *          type: string
 *          example: password123
 *        plan:
 *          type: string
 *          example: free
 *        notificationsEnabled:
 *          type: string
 *          example true
 */

router.get("/", userController.get);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

module.exports = router;
