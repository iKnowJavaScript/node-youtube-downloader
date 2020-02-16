import { Router, Response, NextFunction } from "express";
import { getConnection } from "typeorm";
import httpStatus from "http-status";
import sendResponse from "../helper/response";
import ExtendedRequest from "../typings/extends.interface";
import { customLogger } from "../config/logger";
import { createVideoQueue } from "../services/queue";
import ytdl from "ytdl-core";
import path from "path";
import { Job } from "../entity";
import { STATUS } from "../typings/enum";

const router = Router();

router.route("/new").post(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const jobRepository = await getConnection().getRepository(Job);
  try {
    const url = req.body.url;
    const isValidUrl = ytdl.validateURL(url);
    if (!isValidUrl) {
      res.status(400);
      return res.send({ error: "invalid URL" });
    }
    const job = await jobRepository.create({
      url,
      status: STATUS.STARTED,
    });

    await job.save();
    // await createVideoQueue(global.socket).add({ url, id: job.id });
    await createVideoQueue(job).add({ url, id: job.id });

    res.json(sendResponse(httpStatus.OK, "succesful", job));
  } catch (err) {
    res.status(400);
    customLogger.error(err);
    next(err);
  }
});

router.route("/file/:fileName").get(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const fileName = req.params.fileName;
  const file = path.resolve(__dirname, `../files/${fileName}`);
  res.download(file);
});

export default router;
