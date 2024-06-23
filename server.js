import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/user.route.js";
import { connectDB } from "./database/connection.js";
import { googleAuthRoute } from "./routes/google-auth.route.js";
import passport from "passport";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth2";
import { User } from "./models/user.model.js";
import { blogRoute } from "./routes/blog.route.js";
import { authRoute } from "./routes/auth.route.js";
const { Strategy } = GoogleStrategy;
import { createClient } from "redis";
import RedisStore from "connect-redis";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const port = process.env.SERVER_PORT || 6005;
const app = express();

const redisClient = await createClient({
  url: process.env.REDIS_URI,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    connectTimeout: 5000,
  },
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const redisStore = new RedisStore({
  client: redisClient,
});

// middleware configuration
app.use(
  cors({
    origin: ["https://type-blog-frontend.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
    genid: function (req) {
      const sessionId = uuidv4();
      return sessionId;
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://type-blog-backend.vercel.app/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: "",
            username: `user${Date.now()}`,
          });
        }
        done(null, profile.id);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((googleId, done) => {
  done(null, googleId);
});

passport.deserializeUser(async (googleId, done) => {
  const user = await User.findOne({ googleId });
  done(null, user);
});

// routes
app.use("/api/users", userRoute);
app.use("/auth/google", googleAuthRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/auth", authRoute);

// Handle preflight requests
app.options("*", cors());

// Start serve
app.listen(port, () => {
  console.log(`Your application is listening on http://localhost:${port}`);
  connectDB();
});

connectDB();

export default app;
