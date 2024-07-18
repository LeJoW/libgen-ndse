import { GenericElement } from "../Types/GenericElement";
import { Adapter as AdapterInterface } from "./Adapter.i";
import { Render } from "../Render/Render.i";
import { renderers } from "./renderers";

export class Adapter implements AdapterInterface {
    translation: boolean = false;
    engine: Render;
    symbols: {
        star: string;
        cross: string;
        nbsp: string;
        ampersand: string;
        parnumber: string;
    };
    textStyles = {
        italic: (text: string) => this.engine.orphan("italic", { value: text }),
        bold: (text: string) => this.engine.orphan("bold", { value: text }),
        roman: (text: string) => this.engine.orphan("roman", { value: text }),
    };
    private renderers: { [name: string]: (element: GenericElement) => string };

    constructor(engine: Render) {
        this.engine = engine;
        this.symbols = this.initializeSymbols();
        this.renderers = this.initializeRenderers();
    }

    private initializeSymbols() {
        return {
            star: this.engine.orphan("gstella"),
            cross: this.engine.orphan("gcrux"),
            ampersand: this.engine.orphan("ampersand"),
            nbsp: this.engine.symbol("nbsp"),
            parnumber: this.engine.orphan("forcebreak"),
        };
    }

    private initializeRenderers() {
        return renderers.reduce((acc, wrapper) => {
            const rendererName = wrapper.name.slice(6);
            acc[rendererName] = wrapper(this);
            return acc;
        }, {} as { [name: string]: (element: any) => string });
    }

    render(element: GenericElement): string {
        const renderFunction = this.getRenderFunction(element);
        return renderFunction(element);
    }

    private getRenderFunction(element: GenericElement) {
        const renderFunction = this.renderers[element.constructor.name];
        return renderFunction ?? this.defaultRender;
    }

    private defaultRender(element: GenericElement) {
        return element.content;
    }
}
