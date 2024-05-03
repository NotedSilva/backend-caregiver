import express from "express";

import {
    updateCuidador,
    deleteCuidador,
    getAllCuidador,
    getSingleCuidador,
    getCuidadorProfile
} from '../Controllers/cuidadorController.js';

import { authenticate, restrict } from "../auth/verifyToken.js";

import avaliacaoRouter from './avaliacao.js';

const router = express.Router();

router.use('/:cuidadorId/avaliacoes', avaliacaoRouter);

router.get('/', getAllCuidador);
router.get('/:id', getSingleCuidador);
router.put('/:id', authenticate, restrict(["cuidador"]), updateCuidador);
router.delete('/:id', authenticate, restrict(["cuidador"]), deleteCuidador);

router.get('/perfil/me', authenticate, restrict(["cuidador"]), getCuidadorProfile);

export default router;