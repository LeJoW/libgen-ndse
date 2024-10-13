import { GenericElement as GenericElementInterface } from "./GenericElement.i";
import { TextNode } from "./TextNode.i";

export class GenericElement implements GenericElementInterface {
    TextNodes: TextNode[] = [];
    translation: boolean = false;
}
