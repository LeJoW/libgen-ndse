import { PsalmManager } from "../../Adapter/PsalmManager/PsalmManager.i";
import { TypeConfig } from "../../Rules/Rules.i";
import { Cantus } from "../../Types/Cantus";
import { GregoIndex } from "../../Types/GregoIndex";
import { Psalterium, Psalmus, Canticum } from "../../Types/Psalterium";
import { TextNode } from "../../Types/TextNode";
import { PsalmTitle } from "../../Types/titles";
import { incipits } from "../incipits";

export const psalteriumConfig = (
    gregoIndex: GregoIndex,
    psalmManager: PsalmManager
):TypeConfig => ({
    test: /^@(?:(\d+))?(?:\((\S+)\))?\[([\S\s]+)\]/,
    callback(_, linesTrad, ton, psaumes): Psalterium {
        return psaumes
            .split(";;")
            .reduce(function (
                acc: Psalterium,
                psalmDesc: string,
                index: number
            ): Psalterium {
                const [, psalmDescription, title] = psalmDesc.match(
                    /^\s*(\S+?)\s*(?::\s*(.+))?\s*$/
                ) as string[];
                const isDoxologie = /G$/.test(psalmDescription);
                const psalm = isDoxologie
                    ? psalmDescription.slice(0, -1)
                    : psalmDescription;
                const PsalmConstructor = /\d/.test(psalm) ? Psalmus : Canticum;
                const psalmus = new PsalmConstructor(acc.ton, psalm);
                const { la, fr } = psalmManager.getPsalm(psalmus);
                psalmus.versi = la.map(function (
                    verse: string,
                    index: number
                ): TextNode {
                    const output = new TextNode(verse);
                    output.context = psalmus;
                    acc.TextNodes.push(output);
                    if (fr[index]) {
                        output.fr = fr[index] as string;
                    }
                    return output;
                });
                psalmus.doxologie = isDoxologie;
                psalmus.title =
                    title && title.length > 0
                        ? (() => {
                              const out = new PsalmTitle(new TextNode(title));
                              out.content.context = out;
                              return out;
                          })()
                        : false;
                psalmus.incipit = incipits[psalm] ?? undefined;
                psalmus instanceof Canticum
                    ? gregoIndex.addCanticum(psalmus)
                    : gregoIndex.addPsalmus(psalmus);
                if (index === 0 && acc.ton) {
                    psalmus.intonation = new Cantus(
                        `${psalmus.psalmDivision}-${acc.ton}`
                    );
                }
                acc.addPsalm(psalmus);
                return acc;
            },
            new Psalterium(ton.length > 0 && ton != "0" ? ton : null));
    },
    saveTranslation(psalterium: Psalterium, trad) {
        if (trad.trim() === "{}") {
            return;
        }
        trad.split(";;").map(function (title: string, index: number) {
            title = title.trim();
            const psalm = psalterium.psalms[index];
            if (psalm.intonation) {
                psalm.intonation.translation = true;
                psalm.intonation.text = psalm.versi[0];
            }
            if (title.length > 0) {
                if (!psalm.title) {
                    psalm.title = new PsalmTitle(new TextNode());
                    psalm.title.content.context = psalm.title;
                }
                psalm.title.translation = true;
                psalm.title.content.fr = title;
            }
        });
    },
});
