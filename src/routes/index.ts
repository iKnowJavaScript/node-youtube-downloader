import { Router } from "express";
import jobRoute from "./job";
import sendResponse from "../helper/response";
import httpStatus from "http-status";

const router = Router();

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => {
  return res.json(sendResponse(httpStatus.OK, "Succes", { text: "Ok" }, null));
});

// handle route for product
router.use("/jobs", jobRoute);

export default router;
