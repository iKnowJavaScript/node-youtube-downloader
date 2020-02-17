import http from "http";
import fs from "fs";

import app from "./app";
import config from "./config/env";
import { createDBConnection } from "./config/typeorm";
import { customLogger } from "./config/logger";
import { ExtendedGlobal } from "./typings/extends.interface";
declare const global: ExtendedGlobal;

const port = config.APP_PORT;
const server = http.createServer(app);
const io = require("socket.io")(server, { origins: "*:*" });

global.io = io;

process.on("unhandledRejection", ex => {
  customLogger.error("unhandledRejection", ex);
  process.exit(1);
});
process.on("uncaughtException", ex => {
  customLogger.error("uncaughtException", ex);
  process.exit(1);
});

createDBConnection()
  .then(connection => {
    customLogger.info("Database connection successfull");
    server.listen(port, () => {
      customLogger.info(`App listening on ${config.APP_HOST}:${port}`);
    });

    io.on("connection", (socket: any) => {
      socket.emit("connected", { message: "connected" });
    });

    const logDir = "files";
    // temporary file saver
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
  })
  .catch(err => {
    customLogger.info(`DB Connection failure!, ${err.message}`);
    customLogger.error(err);
  });

//492.77 - 1953.14 -b1649.45
