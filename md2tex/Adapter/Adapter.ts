import { GenericElement } from "../Types/GenericElement";
import { Adapter as AdapterInterface } from "./Adapter.i";
import { Render } from "../Render/Render.i";
import { renderers, renderersTRAD } from "./renderers";

export class Adapter implements AdapterInterface {
    translation: boolean = false;
    engine: Render;
    symbols: {
        star: string;
        cross: string;
        nbsp: string;
        ampersand: string;
        parnumber: string;
        discretionary: string;
        thinspace: string;
    };
    textStyles = {
        italic: (text: string) => this.engine.orphan("italic", { value: text }),
        bold: (text: string) => this.engine.orphan("bold", { value: text }),
        roman: (text: string) => this.engine.orphan("roman", { value: text }),
        smallCaps: (text: string) =>
            this.engine.orphan("smallCaps", { value: text }),
        upper: (text: string) => this.engine.orphan("upper", { value: text }),
    };
    private renderers: { [name: string]: (element: GenericElement) => string };
    private renderersTRAD: Adapter["renderers"];

    constructor(engine: Render) {
        this.engine = engine;
        this.symbols = this.initializeSymbols();
        this.renderers = this.initializeRenderers();
        this.renderersTRAD = this.initializeRenderersTRAD();
    }

    render(element: GenericElement): string {
        const renderFunction = this.translation
            ? this.getRenderFunctionTRAD(element)
            : this.getRenderFunction(element);
        try {
            element = this.renderTextNodesOf(element);
            return renderFunction(element);
        } catch (error) {
            if (error instanceof Error) {
                return this.renderError(`Error : ${error.message}`);
            }
            return this.renderError(`Unknown error : ${element}`);
        }
    }

    private renderTextNodesOf(element: GenericElement) {
        element.TextNodes.map((node) => {
            node.render.fr = (fr) =>
                fr ? this.engine.orphan("frenchpar", { text: fr }) : "";
        });
        return element;
    }

    private initializeSymbols() {
        return {
            star: this.engine.orphan("gstella"),
            cross: this.engine.orphan("gcrux"),
            ampersand: this.engine.orphan("ampersand"),
            nbsp: this.engine.symbol("nbsp"),
            parnumber: this.engine.orphan("forcebreak"),
            discretionary: this.engine.orphan("-"),
            thinspace: this.engine.orphan("thinspace"),
        };
    }

    private initializeRenderers() {
        return renderers.reduce((acc, wrapper) => {
            const rendererName = wrapper.name.slice(6);
            acc[rendererName] = wrapper(this);
            return acc;
        }, {} as { [name: string]: (element: any) => string });
    }

    private initializeRenderersTRAD() {
        return renderersTRAD.reduce((acc, wrapper) => {
            const rendererName = wrapper.name.slice(6, -4);
            acc[rendererName] = wrapper(this);
            return acc;
        }, {} as { [name: string]: (element: any) => string });
    }

    private getRenderFunction(element: GenericElement) {
        const renderFunction = this.renderers[element.constructor.name];
        return renderFunction ?? this.defaultRender;
    }

    private getRenderFunctionTRAD(element: GenericElement) {
        const renderFunction = this.renderersTRAD[element.constructor.name];
        return renderFunction != undefined && element.translation
            ? renderFunction
            : this.getRenderFunction(element);
    }

    private defaultRender(element: GenericElement) {
        return element.constructor.name;
    }

    private renderError(msg: string) {
        return this.engine.orphan("adapterError", { msg });
    }
}
