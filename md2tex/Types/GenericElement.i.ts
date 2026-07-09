import { TextNode } from "./TextNode.i";

export interface GenericElement {
    TextNodes: TextNode[];
    translation: boolean;
    parent: GenericElement | undefined;
}
