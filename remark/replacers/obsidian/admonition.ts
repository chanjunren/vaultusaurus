import { Find, Replace } from "mdast-util-find-and-replace";

const admonitionReplacer: [Find, Replace?] = [
  /code/gi,
  function (value, capture, match) {
    console.log("MATCHIE", match);
    return ":::note\ntest\n:::";
  },
];

export default admonitionReplacer;
