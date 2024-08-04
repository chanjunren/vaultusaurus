import { Find, Replace } from "mdast-util-find-and-replace";
import imageReplacer from "./img";
import tagReplacer from "./tag";

const OBSIDIAN_TRANSFORMERS: [Find, Replace?][] = [imageReplacer, tagReplacer];

export default OBSIDIAN_TRANSFORMERS;
