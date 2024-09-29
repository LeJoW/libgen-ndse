import { GenericElement } from "./GenericElement.i";

export interface TextNode {
    la: string;
    fr: string | false;

    context: GenericElement | undefined;
}
