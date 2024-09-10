import "dotenv/config";
import Debug from "debug";
import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import { PORT } from "./utils/env.js";

const debug = Debug("myapp");
const app = express();
app.use(cors({ origin: false }));

// * Endpoints
app.get("/clock", async (req, res, next) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const intervalID = setInterval(() => {
    // const dtStr = dayjs().format("DD/MM/YYYY HH:mm:ss");
    const dtStr = dayjs().format("HH:mm:ss");
    // ! Need \n\n at the end
    res.write(`data: ${dtStr}\n\n`);
  }, 1000);

  req.on("close", () => {
    debug("Close connection");
    clearInterval(intervalID);
  });
});

// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
