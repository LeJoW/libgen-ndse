import { BlockConfigType } from "../Rules/Rules.i";
import { TableOfContents } from "../Types/TableOfContents";
import { ParagraphStd } from "../Types/paragraphs";
import { GenericElement } from "../Types/GenericElement";
import { GregoIndex } from "../Types/GregoIndex";
import { PsalmManager } from "../Adapter/PsalmManager/PsalmManager.i";
import { TextNode } from "../Types/TextNode";
import { titlesConfig } from "./Types/titles";
import {
    lectioConfig,
    remplacementConfig,
    rubricConfig,
} from "./Types/paragraphs";
import { cantusConfig } from "./Types/cantus";
import { psalteriumConfig } from "./Types/psalterium";

const gregoIndex = new GregoIndex();
const table = new TableOfContents();

const blockConfig = (psalmManager: PsalmManager): BlockConfigType => ({
    desc: [
        titlesConfig(table),
        rubricConfig,
        remplacementConfig,
        lectioConfig,
        cantusConfig(gregoIndex),
        psalteriumConfig(gregoIndex, psalmManager),
        {
            test: /<\s*(\S+)\s*\/>/,
            callback: function (_, tag) {
                switch (tag) {
                    case "grego-index":
                        return gregoIndex;
                    case "table-of-contents":
                        return table;
                    default:
                        return new GenericElement();
                }
            },
        },
    ],
    defaultCase: function (paragraph: string) {
        const p = new ParagraphStd(new TextNode(paragraph));
        p.text.context = p;
        return p;
    },
});

export default blockConfig;
