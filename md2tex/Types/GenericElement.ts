import { GenericElement as GenericElementInterface } from "./GenericElement.i";
import { TextNode } from "./TextNode.i";

export class GenericElement implements GenericElementInterface {
    TextNodes: TextNode[] = [];
    private _translation?: boolean = false;
    private _parent?: GenericElement | undefined;
    public get translation(): boolean {
        return this._translation != undefined && this._translation;
    }
    public set translation(value: boolean) {
        this._translation = value;
    }
    public get parent(): GenericElement | undefined {
        return this._parent;
    }
    public set parent(element: GenericElement | undefined) {
        if (element) {
            this._parent = element;
            this.TextNodes.map(function (node) {
                node.context = element;
            });
        }
    }
}
