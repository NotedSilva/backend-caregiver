import express from "express";

import {
    updateUser,
    deleteUser,
    getAllUser,
    getSingleUser,
    getUserProfile,
    getMyAppointments
} from '../Controllers/userController.js';

import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get('/', authenticate, restrict(["admin"]), getAllUser);
router.get('/:id', authenticate, restrict(["usuario"]), getSingleUser);
router.put('/:id', authenticate, restrict(["usuario"]), updateUser);
router.delete('/:id', authenticate, restrict(["usuario"]), deleteUser);
router.get('/perfil/me', authenticate, restrict(["usuario"]), getUserProfile);
router.get('/consultas/minhas-consultas', authenticate, restrict(["usuario"]), getMyAppointments);

export default router;