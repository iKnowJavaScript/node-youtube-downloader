import Queue from "bull";
import { Job } from "../entity";
import ytdl from "ytdl-core";
import uuidv1 from "uuid/v1";
import util from "util";
import fs from "fs";


import { customLogger } from "../config/logger";
import { getConnection } from "typeorm";
import { STATUS } from "../typings/enum";
import config from "../config/env";
import { ExtendedGlobal } from "../typings/extends.interface";
declare const global: ExtendedGlobal;

const createVideoQueue = (newJob:any) => {
  const videoQueue = new Queue("video transcoding", {
    redis: {
      port: config.REDIS_CONFIG.REDIS_PORT,
      host: config.REDIS_CONFIG.REDIS_HOST,
    },
  });
  videoQueue.process(async (job: any, done) => {
    const jobRepository = await getConnection().getRepository(Job);

    const data = job.data;
    try {
      job.progress(0);
      global.io.emit("progress", { progress: 0, jobId: data.id });
      const uuid = uuidv1();
      const fileLocation = `./files/${uuid}.mp4`;

      await new Promise(resolve => {
        ytdl(data.url)
          .on("progress", (length, downloaded, totallength) => {
            const progress = (downloaded / totallength) * 100;
            global.io.emit("progress", { progress, jobId: data.id });
            if (progress >= 100) {
              global.io.emit("videoDone", { fileLocation: `${uuid}.mp4`, jobId: data.id });
              global.io.emit("progress", { progress: 100, jobId: data.id });
            }
          })
          .pipe(fs.createWriteStream(fileLocation))
          .on("finish", () => {
            resolve();
          });
      });
      await jobRepository
        .createQueryBuilder()
        .update()
        .set({ status: STATUS.DONE, file_location: `${uuid}.mp4` })
        .where("id = :id", { id: newJob.id })
        .execute();

      done();
    } catch (ex) {
      customLogger.error(ex);
      job.moveToFailed();
    }
  });
  return videoQueue;
};
export { createVideoQueue };
