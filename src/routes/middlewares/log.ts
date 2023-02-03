import { Request, Response } from "express";

const requestLoggerMiddleware = (req: Request, res: Response, next) => {
  const date = new Date().toLocaleString();
  const start = Date.now();
  const { url } = req;

  const write = res.write;
  const end = res.end;
  let body = "";
  // @ts-ignore
  res.write = (...args) => {
    body += args[0];
    // @ts-ignore
    write.apply(res, args);
  };

  // @ts-ignore
  res.end = (...args) => {
    if (args[0]) {
      body += args[0];
    }

    console.log("\x1b[1m\n" + "=".repeat(50) + "\x1b[0m");
    console.log(
      `\x1b[1m[${date}] ${req.method} ${
        url.substring(0, url.indexOf("?")) || url
      }\x1b[0m`
    );
    console.log("\x1b[1m" + "-".repeat(50) + "\x1b[0m");
    console.log("\x1b[33m" + "Headers:" + "\x1b[0m");
    console.log(JSON.stringify(req.headers, null, 2));
    console.log("\x1b[33m" + "\nBody:" + "\x1b[0m");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("\x1b[33m" + "\nParams:" + "\x1b[0m");
    console.log(JSON.stringify(req.params || {}, null, 2));
    console.log("\x1b[33m" + "\nQuery:" + "\x1b[0m");
    console.log(JSON.stringify(req.query, null, 2));

    const timeTaken = Date.now() - start;

    console.log("\x1b[32m" + "\nResponse:" + "\x1b[0m");
    console.log(`\x1b[32mStatus: ${res.statusCode}\x1b[0m`);
    console.log(`\x1b[32mBody:\n${body}\x1b[0m`);
    console.log(`\x1b[32mTime taken: ${timeTaken}ms\x1b[0m`);
    console.log("\x1b[1m" + "=".repeat(50) + "\x1b[0m" + "\n");

    // @ts-ignore
    end.apply(res, args);
  };

  next();
};

export default requestLoggerMiddleware;
