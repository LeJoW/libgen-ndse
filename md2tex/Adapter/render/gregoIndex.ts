import { Render } from "../../Render/Render.i";
import { Psalmus } from "../../Types/Psalterium";

/* 
return [
        "\\begin{psIndex}",
        ...index.getSortedIndex().map(function ({ num, incipit, occurrences }) {
            return `\\psEntry{${num}}{${incipit}}{${occurrences
                .map(function ({ anchor, mode }) {
                    return (
                        `\\pageref{${anchor}}` +
                        (mode !== null
                            ? ` \\psMode{${romanNumbers[mode]}}`
                            : "")
                    );
                })
                .join(", ")}}`;
        }),
        "\\end{psIndex}",
    ].join("\n");
*/

function renderPsalmorumIndex(engine: Render, index: Psalmus[]): string {
    return engine.container(
        "psIndex",
        engine.join(
            index.map(function (psalmus: Psalmus): string {
                return engine.orphan("psEntry", {
                    num: psalmus.psalmDivision,
                    incipit: psalmus.incipit,
                    occurences: "[]",
                });
            })
        )
    );
}

export const renderGregoIndex = (engine: Render) => function () {};
