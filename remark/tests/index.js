import { retext } from "retext";
import { reporter } from "vfile-reporter";
import { toMarkdown } from "mdast-util-to-markdown";
import convertToDocusaurusMdt from "../index.js";

const buffer = fs.readFileSync("cases/test1.md");
console.log(toMarkdown(buffer));

// retext()
//   .use(convertToDocusaurusMdx)
//   .process(buffer)
//   .then((file) => {
//     console.error(reporter(file));
//   });
