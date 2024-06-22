import express from "express";
import { isLoggedIn } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  res.sendStatus(200);
});

export const authRoute = router;
