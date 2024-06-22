import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "https://type-blog-frontend.vercel.app",
    failureRedirect: "https://type-blog-frontend.vercel.app/login",
  })
);

export const googleAuthRoute = router;
