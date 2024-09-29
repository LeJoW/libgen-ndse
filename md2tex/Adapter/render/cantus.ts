import { Cantus } from "../../Types/Cantus";
import { Adapter } from "../Adapter.i";

export const renderCantus = ({ engine }: Adapter) =>
    function ({ scorePath, anchor }: Cantus): string {
        return engine.concat([
            anchor ? engine.orphan("anchor", { href: anchor }) : undefined,
            engine.orphan("cantus", { scorePath }),
        ]);
    };

export const renderCantusTRAD = ({ engine }: Adapter) =>
    function ({ scorePath, translation, anchor }: Cantus): string {
        return engine.concat([
            anchor ? engine.orphan("anchor", { href: anchor }) : undefined,
            engine.orphan("cantusTRAD", {
                scorePath: scorePath + "-fr",
                translation,
            }),
        ]);
    };
