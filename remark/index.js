import fs from "fs";
import { retext } from "retext";
import { reporter } from "vfile-reporter";
import convertToDocusaurusMdx from "./plugin.js";

const buffer = fs.readFileSync("tests/test1.md");

retext()
  .use(convertToDocusaurusMdx)
  .process(buffer)
  .then((file) => {
    console.error(reporter(file));
  });
