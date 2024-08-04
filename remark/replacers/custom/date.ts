import { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";
const DATE_TAG_REGEX = /(🗓️\s*\d{8}\s*\d{4}\s*\n)/g;
const myDateTagTransformer: [Find, Replace?] = [
  DATE_TAG_REGEX,
  function (input) {
    return [
      u("text", {
        value: input,
      }),
      u("break"),
    ];
  },
];

export default myDateTagTransformer;
