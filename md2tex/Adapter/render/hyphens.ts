import { Hyphens } from "../../Types/Hyphens";
import { Adapter } from "../Adapter.i";
import { writeFile } from "fs/promises";

export const renderHyphens = ({ engine }: Adapter) =>
    function (hyphens: Hyphens): string {
        if (hyphens.outputFile) {
            writeFile(
                hyphens.outputFile,
                engine.orphan("hyphenation", {
                    list: hyphens.getHyphenatedList().join(" "),
                })
            ).catch(() =>
                console.log(
                    `Error attempting to save hyphenation patterns to ${hyphens.outputFile}`
                )
            );
        }
        return `% Hyphenation patterns saved to ${hyphens.outputFile}`;
    };
