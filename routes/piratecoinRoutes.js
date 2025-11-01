import express from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
} from "../controllers/piratecoinController.js";

const router = express.Router();

// POST /api/movies
router.post("/", createMovie);

// GET /api/movies
router.get("/", getAllMovies);

// GET /api/movies/:id
router.get("/:id", getMovieById);

export default router;
