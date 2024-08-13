import { Find, Replace } from "mdast-util-find-and-replace";
import imageReplacer from "./img";
import noteLinkReplacer from "./noteLink";
import tagReplacer from "./tag";

const OBSIDIAN_TRANSFORMERS: [Find, Replace?][] = [
  imageReplacer,
  tagReplacer,
  noteLinkReplacer,
];

export default OBSIDIAN_TRANSFORMERS;
