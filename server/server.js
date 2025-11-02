import express from "express";
import homeRouter from "../routes/home.router.js";
import environment, { validateEnv } from "../config/env.config.js";
import userRouter from "../routes/user.router.js";
import messagingRouter from '../routes/messaging.router.js';
import orderRouter from '../routes/order.router.js';
import mailerRouter from '../routes/mailer.router.js';
import sessionRouter from "../routes/session.router.js";
import { connectAuto } from "../config/db/connect.config.js";
import logger from "../middlewares/logger.middleware.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import passport from "passport";
import { initPassport } from "../config/auth/passport.config.js";

import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { hbsHelpers } from "./hbs.helpers.js";

const app = express();

const PORT = environment.PORT || 5000;

app.use(express.json());
app.use(logger);
app.use(cookieParser("clave_secreta"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startServer = async () => {
  //validamos variables de entorno
  validateEnv();

  //nos conectamos a la bd
  await connectAuto();

  const store = MongoStore.create({
    client: (await import("mongoose")).default.connection.getClient(),
    ttl: 60 * 60,
  });

  app.use(
    session({
      secret: environment.SESSION_SECRET || "clave_secreta",
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: true,
        //signed: true,
      },
    })
  );

  initPassport();
  app.use(passport.initialize());
  app.use(passport.session());

  // Rutas de Handlebars
  app.engine(
    "handlebars",
    engine({
      defaultLayout: "main",
      layoutDir: path.join(__dirname, "../views/layouts"),
      helpers: hbsHelpers,
    })
  );


  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "../views"));

  app.use("/", homeRouter);
  app.use("/api/users", userRouter);
  app.use("/api/session", sessionRouter);

  // Enrutador de Ordenes
    app.use('/', orderRouter);
    app.use('/', messagingRouter);
    app.use('/', mailerRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Página no encontrada" });
  });

  app.listen(PORT, () =>
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
  );
};
