import { visit } from "unist-util-visit";
import { inspect } from "unist-util-inspect";
import { findAndReplace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";

const OBSIDIAN_IMG_REGEX = /!\[\[([^\]]+)\]\]/g;
const DATE_TAG_REGEX = /(🗓️\s*\d{8}\s*\d{4}\s*\n)/g;

export default function convertToDocusaurusMdx() {
  return async (tree, file) => {
    findAndReplace(tree, [
      [
        DATE_TAG_REGEX,
        function ($0) {
          return u();
        },
      ],
      [OBSIDIAN_IMG_REGEX, "$1<br/>"],
    ]);
    console.log(
      inspect(tree, {
        showPositions: false,
      })
    );
  };
}
