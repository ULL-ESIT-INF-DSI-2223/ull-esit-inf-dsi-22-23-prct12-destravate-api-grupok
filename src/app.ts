import express from "express";
import "./db/mongoose.js";
import { userRouter } from "./routers/user.js";
import { trackRouter } from "./routers/track.js";
import { groupRouter } from "./routers/group.js";
import { challengeRouter } from "./routers/challenge.js";
import { defaultRouter } from "./routers/default.js";

/**
 * Definición de la aplicación express
 */
export const app = express();

/**
 * Se define que el formato de los datos que se reciben y envían es JSON
 */
app.use(express.json());

/**
 * Se definen los routers que se van a usar en la aplicación
 */
app.use(userRouter);
app.use(groupRouter);
app.use(trackRouter);
app.use(challengeRouter);
app.use(defaultRouter);

