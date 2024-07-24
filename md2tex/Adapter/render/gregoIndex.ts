import { Render } from "../../Render/Render.i";
import { GregoIndex } from "../../Types/GregoIndex";
import { Psalmus } from "../../Types/Psalterium";
import { Adapter } from "../Adapter.i";

const titles: {
    [key: string]: string;
} = {
    antiphonae: "Antiphonæ",
    hymni: "Hymni",
    responsoria: "Responsoria",
    psalmi: "Psalmi",
    cantica: "Cantica",
};

const titlesTRAD: {
    [key: string]: string;
} = {
    antiphonae: "Antiennes",
    hymni: "Hymnes",
    responsoria: "Répons",
    psalmi: "Psaumes",
    cantica: "Cantiques",
};

export const renderGregoIndex = (adapter: Adapter) =>
    function (grergoIndex: GregoIndex): string {
        const psalmi = grergoIndex.getPsalmos();
        const cantica = grergoIndex.getCanticos();
        const canti = grergoIndex.getCantos();
        return adapter.engine.join([
            Object.keys(psalmi).length > 0
                ? renderPsalmorumIndex(adapter, psalmi)
                : undefined,
            Object.keys(cantica).length > 0
                ? renderCanticorumIndex(adapter, cantica)
                : undefined,
            renderCantorumIndex(adapter, canti),
        ]);
    };

function renderPsalmorumIndex(
    { engine, translation }: Adapter,
    index: GregoIndex["psalmi"]
): string {
    return engine.join([
        engine.orphan("tableTitle", {
            title: (translation ? titlesTRAD : titles)["psalmi"],
        }),
        engine.container(
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
        ),
    ]);
}

function renderCanticorumIndex(
    { engine, translation }: Adapter,
    index: GregoIndex["psalmi"]
): string {
    return engine.join([
        engine.orphan("tableTitle", {
            title: (translation ? titlesTRAD : titles)["cantica"],
        }),
        engine.container(
            "cantIndex",
            engine.join(
                Object.values(index).map(function (
                    entries
                ): string | undefined {
                    if (entries.length === 0) {
                        return undefined;
                    }
                    return engine.orphan("cantEntry", {
                        incipit: entries[0].incipit,
                        occurrences: renderOccurrences(engine, entries),
                    });
                })
            )
        ),
    ]);
}

const int2roman = [, "i", "ii", "iii", "iv", "v", "vi", "vii", "viii"];
function renderOccurrences(engine: Render, list: Psalmus[]) {
    return list
        .map(function ({ anchor, mode, ton }): string {
            const printedMode = mode && !isNaN(mode) ? mode : ton;
            return [
                engine.orphan("pageref", { href: anchor }),
                printedMode ? engine.symbol("nbsp") : undefined,
                printedMode
                    ? engine.orphan("psMode", {
                          value:
                              int2roman[printedMode as number] ?? printedMode,
                      })
                    : undefined,
            ].join("");
        })
        .join(", ");
}

function renderCantorumIndex(
    { engine, translation }: Adapter,
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
                        value:
                            (translation ? titlesTRAD : titles)[
                                type as string
                            ] ?? type,
                    }),
                    engine.container(
                        "gregList",
                        engine.join(
                            list.map(function (alphabeticGroup) {
                                return engine.container(
                                    "gregAlphabeticGroup",
                                    engine.join(
                                        alphabeticGroup.map(function ({
                                            ton,
                                            mode,
                                            incipit,
                                            anchor,
                                        }) {
                                            return engine.orphan("gregEntry", {
                                                mode:
                                                    mode && !isNaN(mode)
                                                        ? mode
                                                        : ton,
                                                incipit,
                                                anchor,
                                            });
                                        })
                                    )
                                );
                            })
                        )
                    ),
                ]);
            })
        )
    );
}
