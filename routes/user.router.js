import { Router } from "express";
import { requireJwtCookie } from "../middlewares/auth.middleware.js";
import { policies } from '../middleware/policies.middleware.js';
import { userController as ctrl } from '../controllers/user.controller.js';


const router = new Router();

router.use(requireJwtCookie);

// Vistas
router.get('/users', (req, res) => ctrl.listView(req, res));

// API REST
router.get('/api/users', (req, res) => ctrl.listJSON(req, res));
router.get('/api/users/:id', policies('admin', 'user'), (req, res) => ctrl.getById(req, res));
router.get('/api/users/:code', policies('admin', 'user'), (req, res) => ctrl.getByCode(req, res));
router.post('/api/users/', policies('admin'), (req, res) => ctrl.create(req, res));
router.put('/api/users/:id', policies('admin'), (req, res) => ctrl.update(req, res));
router.delete('/api/users/:id', policies('admin'), (req, res) => ctrl.remove(req, res));


// Semilla Base
router.post('/api/users/seed', policies('admin', 'user'), (req, res) => ctrl.seed(req, res));

export default router;