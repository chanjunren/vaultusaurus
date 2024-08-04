import { retext } from "retext";
import { reporter } from "vfile-reporter";
import convertToDocusaurusMdx from "../index.js";

const buffer = fs.readFileSync("example.md");

retext()
  .use(convertToDocusaurusMdx)
  .process(buffer)
  .then((file) => {
    console.error(reporter(file));
  });
