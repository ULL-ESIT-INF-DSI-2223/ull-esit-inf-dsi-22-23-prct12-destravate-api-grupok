import express from "express";

/**
 * Ruta por defecto para cualquier petición que no se haya definido
 */
export const defaultRouter = express.Router();

/**
 * Cualquier petición que no se haya definido se responde con un 501
 */
defaultRouter.all("*", (_, res) => {
  res.status(501).send();
});
