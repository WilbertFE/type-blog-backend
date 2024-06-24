import express from "express";
import { isLoggedIn, googleAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  res.sendStatus(200);
});

router.post("/google", googleAuth);

export const authRoute = router;
