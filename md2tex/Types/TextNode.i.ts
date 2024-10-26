import { GenericElement } from "./GenericElement.i";

export interface TextNode {
    la: string;
    fr: string | false;

    render: {
        la: (la: string) => string;
        fr: (fr: string | false) => string;
    };

    context: GenericElement | undefined;
}
