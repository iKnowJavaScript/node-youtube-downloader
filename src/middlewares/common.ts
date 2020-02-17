import { Router } from "express";
import cors from "cors";
import parser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import logger from "morgan";
import methodOverride from "method-override";
import helmet from "helmet";
import expressWinston from "express-winston";
import { customLogger as winstonInstance } from "../config/logger";

const handleHelmet = (router: Router) => {
  router.use(helmet());
};

const handleCors = (router: Router) => router.use(cors({ credentials: true, origin: true }));

const handleBodyRequestParser = (router: Router) => {
  router.use(parser.json());
  router.use(parser.urlencoded({ extended: true }));
};

const handleCompression = (router: Router) => {
  router.use(compression());
};

const parseCookies = (router: Router) => {
  router.use(cookieParser());
};

const handleOveride = (router: Router) => {
  router.use(methodOverride());
};

// Setup Request logging
const apiLogger = (router: Router) => {
  // enable detailed API logging in dev env
  //comment this code to reduce api logs
  if (process.env["NODE_ENV"] === "development" || process.env["NODE_ENV"] === "staging") {
    router.use(logger("dev"));
    expressWinston.responseWhitelist.push("body");
    router.use(
      expressWinston.logger({
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
      }),
    );
  }
  return;
};

export default [
  handleHelmet,
  handleCors,
  handleBodyRequestParser,
  parseCookies,
  handleCompression,
  handleOveride,
  apiLogger,
];
