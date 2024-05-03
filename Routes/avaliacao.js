import express from "express";
import { createAvaliacao, getAllAvaliacoes } from "../Controllers/avaliacaoController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router({ mergeParams: true });

router.route('/')
.get(getAllAvaliacoes)
.post( authenticate, restrict(["usuario"]), createAvaliacao)

export default router;