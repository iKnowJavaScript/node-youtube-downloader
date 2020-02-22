import Queue from "bull";
import { Job } from "../entity";
import ytdl from "ytdl-core";
import fs from "fs";

import { customLogger } from "../config/logger";
import { getConnection } from "typeorm";
import { STATUS } from "../typings/enum";
import config from "../config/env";
import { ExtendedGlobal } from "../typings/extends.interface";
declare const global: ExtendedGlobal;

const createVideoQueue = (newJob: Job) => {
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
      const uuid = newJob.id;
      let size;
      let title;
      const fileLocation = `./files/${uuid}.mp4`;

      await new Promise(resolve => {
        ytdl(data.url)
          .on("info", info => {
            title = info.title;
          })
          .on("progress", (length, downloaded, totallength, title) => {
            const progress = (downloaded / totallength) * 100;
            size = totallength / 1000000;
            global.io.emit("progress", { progress, jobId: data.id });
            if (progress >= 100) {
              global.io.emit("video_done", { fileLocation: `${uuid}.mp4`, jobId: data.id });
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
        .set({ status: STATUS.DONE, file_location: `${uuid}.mp4`, size, title })
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
export default createVideoQueue;
