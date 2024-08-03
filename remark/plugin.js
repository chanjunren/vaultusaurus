import { findAndReplace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";

const OBSIDIAN_IMG_REGEX = /!\[\[([^\]]+)\]\]/g;
const DATE_TAG_REGEX = /(🗓️\s*\d{8}\s*\d{4}\s*\n)/g;

export default function convertToDocusaurusMdx() {
  return async (tree) => {
    findAndReplace(tree, [
      [
        DATE_TAG_REGEX,
        function (input) {
          return [
            u("text", {
              value: input,
            }),
            u("break"),
          ];
        },
      ],
      [
        OBSIDIAN_IMG_REGEX,
        function (input) {
          const fileName = input.slice(3, -2);
          return u("image", {
            url: `/${fileName}`,
            alt: fileName,
            title: fileName,
          });
        },
      ],
    ]);

    // console.log(
    //   inspect(tree, {
    //     showPositions: false,
    //   })
    // );
  };
}
