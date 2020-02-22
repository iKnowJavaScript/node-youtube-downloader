import { Router, Response, NextFunction } from "express";
import { getConnection } from "typeorm";
import httpStatus from "http-status";
import ytdl from "ytdl-core";
import path from "path";

import ExtendedRequest from "../typings/extends.interface";
import createVideoQueue from "../services/queue";
import { customLogger } from "../config/logger";
import sendResponse from "../helper/response";
import { STATUS } from "../typings/enum";
import { Job } from "../entity";

const router = Router();

router.route("/new").post(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const jobRepository = await getConnection().getRepository(Job);

    const url = req.body.url;

    const jobAvailable = await jobRepository.findOne({ url });
    if (jobAvailable && jobAvailable.file_location) {
      let file = path.resolve(__dirname, `../../files/${jobAvailable.file_location}`);
      if (file) {
        res.status = httpStatus.FOUND as any;
        return res.json(sendResponse(httpStatus.FOUND, "succesful", jobAvailable));
      }
    }

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
  const file = path.resolve(__dirname, `../../files/${fileName}`);

  if (!file) {
    res.statusCode = httpStatus.NOT_FOUND;
    return res.json(sendResponse(httpStatus.NOT_FOUND, "Video not found", null));
  }
  res.download(file);
});

router.route("/:status").get(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const status = req.params.status as STATUS;

  let { page = 0, take = 10 } = req.query;
  (page = +page), (take = +take);
  const skip = page * take;

  if (!status) {
    res.statusCode = httpStatus.BAD_REQUEST;
    return res.json(sendResponse(httpStatus.BAD_REQUEST, "Invalid status", null));
  }

  try {
    const jobRepository = await getConnection().getRepository(Job);
    const jobs = await jobRepository.find({
      order: {
        title: "ASC",
      },
      skip,
      take,
      where: {
        status,
      },
    });

    res.json(sendResponse(httpStatus.OK, "succesful", jobs));
  } catch (err) {
    res.status(400);
    customLogger.error(err);
    next(err);
  }
});

export default router;
