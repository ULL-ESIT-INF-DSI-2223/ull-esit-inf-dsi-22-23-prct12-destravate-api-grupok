import express from "express";
import "./db/mongoose.js";
import { userRouter } from "./routers/user.js";
import { trackRouter } from "./routers/track.js";
import { groupRouter } from "./routers/group.js";
import { challengeRouter } from "./routers/challenge.js";

export const app = express();
app.use(express.json());
app.use(userRouter);
app.use(groupRouter);
app.use(trackRouter);
app.use(challengeRouter);
