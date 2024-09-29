import { GenericElement } from "./GenericElement.i";
import { TextNode as TextNodeInterface } from "./TextNode.i";

export class TextNode implements TextNodeInterface {
    context: GenericElement | undefined;
    la: string;
    fr: string | false = false;

    constructor(text?: string) {
        this.la = text ? text : "";
    }

    onConstruct() {}
}
