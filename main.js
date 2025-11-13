import { program } from "commander";
import fs from "node:fs/promises";
import path from "node:path";
import express from "express";

program
  .requiredOption('-h, --host <host>', 'host address')
  .requiredOption("-c, --cache <path>", "path to the input JSON file")
  .requiredOption('-p, --port <port>', 'server port', (value) => {
    const parsed = Number(value);
    if (!parsed || parsed < 1 || parsed > 65535) {
      console.error("port must be number between 1 and 65535");
      process.exit(1);
    }
    return parsed;
  })
  .parse();

const opts = program.opts();

async function setupCacheDir(path) {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1)
  }
}

const cacheDir = path.resolve(opts.cache);
await setupCacheDir(cacheDir);

const app = express();

app.listen(opts.port, opts.host, () => {
  console.log(`server is running at http://${opts.host}:${opts.port}`);
});