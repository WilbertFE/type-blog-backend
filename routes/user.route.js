import express from "express";
import { getMyData, getUser } from "../controllers/user.controller.js";
import { isLoggedIn } from "../controllers/auth.controller.js";

const route = express.Router();

route.get("/me", isLoggedIn, getMyData);

route.get("/:username", getUser);

export const userRoute = route;
