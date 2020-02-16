import { createConnection, ConnectionOptions } from "typeorm";
import config from "../config/env";
import { Job } from "../entity";

export const createDBConnection = async () => {
  const entities: {} = {
    entities: [Job],
  };
  const options: ConnectionOptions = { ...config.TYPEORM_CONFIG, ...entities };
  return await createConnection({ ...options, name: "default" });
};
