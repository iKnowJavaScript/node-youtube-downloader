import express from "express";
import "reflect-metadata";


import { handleAPIDocs } from "./middlewares/apiDocs";
import apiRouter from "./routes/index";
import { applyMiddleware } from "./helper/applyMiddleware";
import commonMiddlewares from "./middlewares/common";
import errorHandlers from "./middlewares/errorHandlers";

const app = express();
applyMiddleware([...commonMiddlewares, handleAPIDocs], app);

app.use("/api/v1", apiRouter);

applyMiddleware(errorHandlers, app);

export default app;
