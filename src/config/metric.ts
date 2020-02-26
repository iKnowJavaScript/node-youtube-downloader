import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;

const counter = new client.Counter({
  name: "metric_counter",
  help: "metric_help",
});
counter.inc(); // Inc with 1

new client.Histogram({
  name: "metric_histogram",
  help: "metric_help",
  buckets: [0.1, 5, 15, 50, 100, 500],
});

const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register, prefix: "youtube_downloader" });

export { register };
