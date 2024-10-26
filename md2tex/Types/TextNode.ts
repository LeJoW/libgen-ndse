import { GenericElement } from "./GenericElement.i";
import { TextNode as TextNodeInterface } from "./TextNode.i";

export class TextNode implements TextNodeInterface {
    la: string;
    private _fr: string | false = false;
    public get fr(): string | false {
        return this.render.fr(this._fr);
    }
    public set fr(value: string | false) {
        this._fr = value;
    }

    constructor(text?: string) {
        this.la = text ? text.trim() : "";
    }
    render = {
        la: function (la: TextNode["la"]) {
            return la;
        },
        fr: function (fr: TextNode["fr"]) {
            return fr || "";
        },
    };

    set context(element: GenericElement) {
        element.TextNodes.push(this);
    }
}
