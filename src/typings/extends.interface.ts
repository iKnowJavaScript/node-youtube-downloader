import Global = NodeJS.Global;
import { Request } from "express";

export default interface ExtendedRequest extends Request {
  [key: string]: any;
}

export interface ExtendedGlobal extends Global {
  io: any;
}
