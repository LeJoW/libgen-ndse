import { Render } from "../Render/Render.i";
import { GenericElement } from "../Types/GenericElement";

export interface Adapter {
    translation: boolean;
    engine: Render;

    render(element: GenericElement): string;

    textStyles: {
        italic(text: string): string;
        bold(text: string): string;
        roman(text: string): string;
        smallCaps(text: string): string;
        upper(text: string): string;
    };

    symbols: {
        star: string;
        cross: string;
        nbsp: string;
        ampersand: string;
        parnumber: string;
    };
}
