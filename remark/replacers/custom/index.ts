import { Find, Replace } from "mdast-util-find-and-replace";
import myDateTagTransformer from "./date";

const CUSTOM_TRANSFORMERS: [Find, Replace?][] = [myDateTagTransformer];

export default CUSTOM_TRANSFORMERS;
