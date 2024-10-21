import { GenericElement as GenericElementInterface } from "./GenericElement.i";
import { TextNode } from "./TextNode.i";

export class GenericElement implements GenericElementInterface {
    TextNodes: TextNode[] = [];
    private _translation?: boolean = false;
    public get translation(): boolean {
        return this._translation != undefined && this._translation;
    }
    public set translation(value: boolean) {
        this._translation = value;
    }
}
