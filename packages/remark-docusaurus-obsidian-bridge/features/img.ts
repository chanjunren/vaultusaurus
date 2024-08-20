import { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";

const OBSIDIAN_IMG_REGEX = /!\[\[([^\]]+)\]\]/g;

const imageReplacer: [Find, Replace?] = [
  OBSIDIAN_IMG_REGEX,
  function (input) {
    const fileName = input.slice(3, -2);
    return u("image", {
      url: `/${fileName}`,
      alt: fileName,
      title: fileName,
    });
  },
];

export default imageReplacer;
