import { BlockConfigType } from "../Rules/Rules.i";
import { TableOfContents } from "../Types/TableOfContents";
import { ParagraphStd } from "../Types/paragraphs";
import { GenericElement } from "../Types/GenericElement";
import { GregoIndex } from "../Types/GregoIndex";
import { PsalmManager } from "../Adapter/PsalmManager/PsalmManager.i";
import { TextNode as TextNodeBase } from "../Types/TextNode";
import { titlesConfig } from "./Types/titles";
import {
    lectioConfig,
    remplacementConfig,
    rubricConfig,
} from "./Types/paragraphs";
import { cantusConfig } from "./Types/cantus";
import { psalteriumConfig } from "./Types/psalterium";
import { Hyphens } from "../Types/Hyphens";

const hyphens = new Hyphens();
const gregoIndex = new GregoIndex();
const table = new TableOfContents();

export class TextNode extends TextNodeBase {
    constructor(text?: string) {
        super(text);
        if (text) {
            hyphens.registerString(text);
        }
    }
}

const blockConfig = (psalmManager: PsalmManager): BlockConfigType => ({
    desc: [
        titlesConfig(table),
        rubricConfig,
        remplacementConfig,
        lectioConfig,
        cantusConfig(gregoIndex),
        psalteriumConfig(gregoIndex, psalmManager),
        {
            test: /<\s*(\S+)\s*(\S*)\s*\/>/,
            callback: function (_, tag, attributes) {
                switch (tag) {
                    case "grego-index":
                        return gregoIndex;
                    case "table-of-contents":
                        return table;
                    case "hyphens":
                        const element = hyphens;
                        element.outputFile = attributes.replace(
                            /file="(\S+)"/,
                            "$1"
                        );
                        return element;
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
    defaultCaseSaveTranslation: function (
        paragraph: ParagraphStd,
        translation: string
    ) {
        paragraph.text.fr = translation;
    },
});

export default blockConfig;
