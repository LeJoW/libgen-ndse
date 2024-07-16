import { Render } from "../Render/Render.i";

export const renderCantus = (engine: Render) =>
    function (file: string, anchor: string | null): string {
        return engine.concat([
            anchor ? engine.orphan("anchor", { href: anchor }) : undefined,
            engine.orphan("cantus", { file }),
        ]);
    };
