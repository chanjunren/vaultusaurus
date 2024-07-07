import fs from "fs";
import { retext } from "retext";
import { reporter } from "vfile-reporter";
import convertToDocusaurusMdx from "./plugin.js";

const buffer = fs.readFileSync("../../docs/zettelkasten/activity_diagrams.md");

retext()
  .use(convertToDocusaurusMdx)
  .process(buffer)
  .then((file) => {
    console.error(reporter(file));
  });
