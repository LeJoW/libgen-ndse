import { Render } from "../../Render/Render.i";
import { GregoIndex } from "../../Types/GregoIndex";
import { Psalmus } from "../../Types/Psalterium";
import { Adapter } from "../Adapter.i";

export const renderGregoIndex = ({ engine }: Adapter) =>
    function (grergoIndex: GregoIndex): string {
        const psalmi = grergoIndex.getPsalmos();
        const cantica = grergoIndex.getCanticos();
        const canti = grergoIndex.getCantos();
        return engine.join([
            Object.keys(psalmi).length > 0
                ? renderPsalmorumIndex(engine, psalmi)
                : undefined,
            Object.keys(cantica).length > 0
                ? renderCanticorumIndex(engine, cantica)
                : undefined,
            renderCantorumIndex(engine, canti),
        ]);
    };

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
                    occurrences: renderOccurrences(engine, entries),
                });
            })
        )
    );
}

function renderCanticorumIndex(
    engine: Render,
    index: GregoIndex["psalmi"]
): string {
    return engine.container(
        "cantIndex",
        engine.join(
            Object.values(index).map(function (entries): string | undefined {
                if (entries.length === 0) {
                    return undefined;
                }
                return engine.orphan("cantEntry", {
                    incipit: entries[0].incipit,
                    occurrences: renderOccurrences(engine, entries),
                });
            })
        )
    );
}

function renderOccurrences(engine: Render, list: Psalmus[]) {
    return list
        .map(function ({ anchor, mode }): string {
            return engine.concat([
                engine.orphan("pageref", { href: anchor }),
                mode !== null ? engine.orphan("psMode", { mode }) : undefined,
            ]);
        })
        .join(", ");
}

const titles: {
    [key: string]: string;
} = {
    antiphonae: "Antiphonæ",
    hymni: "Hymni",
    responsoria: "Responsoria",
};

function renderCantorumIndex(
    engine: Render,
    index: ReturnType<GregoIndex["getCantos"]>
) {
    return engine.container(
        "gregIndex",
        engine.join(
            Object.entries(index).map(function ([type, list]) {
                if (list.length === 0) {
                    return engine.concat([]);
                }
                return engine.join([
                    engine.orphan("tableTitle", {
                        value: titles[type as string] ?? type,
                    }),
                    engine.container(
                        "gregList",
                        engine.join(
                            list.map(function (alphabeticGroup) {
                                return engine.join([
                                    engine.join(
                                        alphabeticGroup.map(function ({
                                            mode,
                                            incipit,
                                            anchor,
                                        }) {
                                            return engine.orphan("gregEntry", {
                                                mode: mode ?? "",
                                                incipit,
                                                anchor,
                                            });
                                        })
                                    ),
                                ]);
                            })
                        )
                    ),
                ]);
            })
        )
    );
}
