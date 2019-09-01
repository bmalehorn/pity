// import * as express from "express";

// console.log("hello world");

// const app = express();
const PORT = Number(process.env.PORT) || 3000;
// app.get("/", (_req: Request, res: Response) => {
//   res.send({
//     message: "hello world"
//   });
// });
// app.listen(PORT, () => {
//   console.log("server started at http://localhost:" + PORT);
// });

import * as os from "os";
import * as pty from "node-pty";
import * as express from "express";
import * as expressWsModule from "express-ws";

// console.log(pty, express, expressWs);

const app = express();
const expressWs = expressWsModule(app);

// Serve static assets from ./static
app.use(express.static(`${__dirname}/static`));

// Instantiate shell and set up data handlers
expressWs.app.ws("/shell", (ws, _req) => {
  var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

  var ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });

  ptyProcess.on("data", data => {
    console.log("data =", data);
    ws.send(data);
  });

  ws.on("message", msg => {
    console.log("got message", msg);
    if (typeof msg === "string") {
      ptyProcess.write(msg);
    } else {
      console.log("uh-oh! not a string");
    }
  });

  ptyProcess.write("echo hello\r");
  ptyProcess.resize(100, 40);
});

console.log("listing on ", PORT);
// // Start the application
app.listen(PORT, "localhost", () => {
  console.log("... running %s mode", app.settings.env);
});
