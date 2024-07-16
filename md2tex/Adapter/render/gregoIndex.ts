import { Render } from "../../Render/Render.i";
import { GregoIndex } from "../../Types/GregoIndex";

function renderPsalmorumIndex(
    engine: Render,
    index: GregoIndex["psalmi"]
): string {
    return engine.container(
        "psIndex",
        engine.join(
            Object.entries(index).map(function ([num, entries]):
                | string
                | undefined {
                if (entries.length === 0) {
                    return undefined;
                }
                return engine.orphan("psEntry", {
                    num,
                    incipit: entries[0].incipit,
                    occurrences: entries
                        .map(function ({ anchor, mode }): string {
                            return engine.concat([
                                engine.orphan("anchor", { href: anchor }),
                                mode !== null
                                    ? engine.orphan("psMode", { mode })
                                    : undefined,
                            ]);
                        })
                        .join(", "),
                });
            })
        )
    );
}

export const renderGregoIndex = (engine: Render) =>
    function (grergoIndex: GregoIndex): string {
        return renderPsalmorumIndex(engine, grergoIndex.getPsalmos());
    };
