import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

import APIError from "../helper/APIError";
import { customErrorMessage } from "../helper/joiCustomError";
import IErrorResponse from "../typings/errorResponse.types";
import { isJoiError } from "../helper/isJoiError";

interface ErrorTypes extends Error {
  errors: string;
  status: number;
}

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
export const handler = (err: ErrorTypes, _req: Request, res: Response, _next: NextFunction) => {
  const response: IErrorResponse = {
    statusCode: err.status,
    //@ts-ignore
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    payload: null,
    stack: err.stack,
  };
  if (process.env.NODE_ENV !== "development") {
    delete response.stack;
  }
  res.statusCode = response.statusCode;
  res.json(response);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
export const converter = (err: ErrorTypes, req: Request, res: Response, _next: NextFunction) => {
  let convertedError: Error = err;
  try {
    if (isJoiError(err)) {
      convertedError = new APIError({
        message: "Invalid fields",
        status: httpStatus.BAD_REQUEST, //unprocessible entity
        //@ts-ignore
        errors: customErrorMessage(err.joi.details) || {},
        payload: {},
      });
    } else if (!(err instanceof APIError)) {
      convertedError = new APIError({
        message: err.message,
        status: err.status,
        stack: err.stack,
        errors: null,
      });
    }
  } catch (error) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
      errors: null,
    });
  }
  //@ts-ignore
  return handler(convertedError, req, res);
};

/**
 *
 * @param {Error} err
 * @param {} req
 * @param {*} res
 */
export const errorHandler = (err: Error, _req: Request, _res: Response, next: NextFunction) => {
  if (err) {
    //@ts-ignore
    const tokenError = new APIError("Unauthorized", err.status, true);
    next(tokenError);
  }
  next();
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
export const notFound = (req: Request, res: Response) => {
  //@ts-ignore
  const err = new APIError({
    message: "Not found",
    status: httpStatus.NOT_FOUND,
  });
  //@ts-ignore
  return handler(err, req, res);
};
