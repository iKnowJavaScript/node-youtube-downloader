import { Router } from "express";
import { converter, handler, notFound } from "../config/error";

const convertError = (router: Router) => {
  // If error is not an instanceOf APIError, convert it.
  router.use(converter);
};

const handleNotFoundError = (router: Router) => {
  // Catch 404 and forward to error handler
  router.use(notFound);
};

const handleDevError = (router: Router) => {
  // Error handler, send stacktrace only during development
  router.use(handler);
};

export default [convertError, handleDevError, handleNotFoundError];
