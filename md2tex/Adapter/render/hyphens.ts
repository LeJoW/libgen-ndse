import { Hyphens } from "../../Types/Hyphens";
import { Adapter } from "../Adapter.i";

export const renderHyphens = ({ engine }: Adapter) =>
    function (hyphens: Hyphens): string {
        return engine.orphan("hyphenation", {
            list: hyphens.getHyphenatedList().join(" "),
        });
    };
