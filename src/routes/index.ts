import { Router } from "express";
import jobRoute from "./job";
import sendResponse from "../helper/response";
import httpStatus from "http-status";
import { register } from "../config/metric";

const router = Router();

// Expose Metrics endpoint
router.get("/metrics", (req, res) => {
  res.set("Content-Tye", "text/plain").send(register.metrics());
});

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => {
  return res.json(sendResponse(httpStatus.OK, "Succes", { text: "Ok" }, null));
});

// handle route for product
router.use("/jobs", jobRoute);

export default router;
