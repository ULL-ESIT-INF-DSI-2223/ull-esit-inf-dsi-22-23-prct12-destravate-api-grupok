import { app } from "./app.js";

/**
 * Se define el puerto en el que se va a ejecutar la aplicación, es el puerto 
 * 3000 por defecto o el que se haya definido en la variable de entorno PORT
 */
const port = 3000 || process.env.PORT;

/**
 * Se crea el punto de entrada de la aplicación
 */
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
