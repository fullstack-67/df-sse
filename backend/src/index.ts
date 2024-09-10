import "dotenv/config";
import Debug from "debug";
import express from "express";
import cors from "cors";
import { PORT } from "./utils/env.js";
import { nanoid } from "nanoid";

const debug = Debug("myapp");
const app = express();
app.use(cors({ origin: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
interface Subs {
  id: string;
  res: any;
}
interface Todo {
  id: string;
  title: string;
}

let todos: Todo[] = [];
let subs: Subs[] = [];

function broadcastToAllSubscribers(subs: Subs[], mode: "ADD" | "DELETE") {
  subs.forEach((s) => {
    debug(`Sending to ${s.id}`);
    s.res.write(`data: ${mode}\n\n`);
  });
}

// * Endpoints
app.get("/subscribe", async (req, res, next) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
  const subscriberID = nanoid();
  subs.push({
    id: subscriberID,
    res: res,
  });
  res.write("data: ping\n\n");
  debug(`Add subscriber: ${subscriberID}`);
  debug(`Current subs: ${subs.length}`);

  req.on("close", () => {
    debug(`Close connection for ${subscriberID}`);
    subs = subs.filter((s) => s.id !== subscriberID);
  });
});

app.get("/todos", (req, res, next) => {
  res.status(200).json({ todos });
});

app.post("/todos", (req, res, next) => {
  const title = req.body?.title ?? "";
  if (title) {
    todos.push({
      id: nanoid(),
      title: req.body.title ?? "",
    });
    broadcastToAllSubscribers(subs, "ADD");
  }
  res.end();
});

app.delete("/todos", (req, res, next) => {
  const id = req.body?.id ?? "";
  if (id) {
    todos = todos.filter((todo) => todo.id !== id);
    broadcastToAllSubscribers(subs, "DELETE");
  }
  res.end();
});

// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
