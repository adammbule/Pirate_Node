import express from "express";
import {
  createKeyReference,
  getKeyReferenceByMovie,
} from "../controllers/keyReferenceController.js";

const router = express.Router();

// POST /api/keyrefs
router.post("/createkeyref", createKeyReference);

// GET /api/keyrefs/:movieId
router.get("/keyrefs/:movieId", getKeyReferenceByMovie);

export default router;
