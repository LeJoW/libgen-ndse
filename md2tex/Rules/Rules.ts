import { Document } from "../Document/Document.i";
import {
    Rules as RulesInterface,
    BlockConfigType,
    StringConfigType,
    translatedBlock,
    parser,
    LangStringConfig,
    converter,
} from "./Rules.i";

export class Rules implements RulesInterface {
    private desc: BlockConfigType["desc"];
    private defaultCase: BlockConfigType["defaultCase"];
    private strConverters: StringConfigType;

    preprocessor = function (block: string) {
        return block.split(/\n\s*\n/g);
    };

    translater = function (block: string): translatedBlock {
        return { block, translation: false };
    };

    constructor(
        { desc, defaultCase }: BlockConfigType,
        strConfig: StringConfigType
    ) {
        this.desc = desc;
        this.defaultCase = defaultCase;
        this.strConverters = strConfig;
    }

    preprocess(doc: Document): string[] {
        return this.preprocessor(doc.getContent());
    }

    getTranslation(block: string) {
        return this.translater(block);
    }

    getBlockConverter(block: string) {
        const possibleConverters = this.desc.filter(function ({ test }) {
            return test.test(block);
        });
        if (possibleConverters.length > 1) {
            throw new Error("Multiple converters for block " + block);
        }
        const output: parser =
            possibleConverters.length === 0
                ? {
                      mask: /([\S\s]*)/,
                      replace: this.defaultCase,
                  }
                : {
                      mask: possibleConverters[0].test,
                      replace: possibleConverters[0].callback,
                  };
        if (possibleConverters[0] && possibleConverters[0].saveTranslation) {
            output.storeTranslation = possibleConverters[0].saveTranslation;
        }
        return output;
    }

    buildConverters(
        converters: LangStringConfig,
        lang: "la" | "fr"
    ): converter[] {
        return converters.map(function ({ test, callback }): converter {
            return {
                mask: test,
                replace: callback,
                lang: lang,
            };
        });
    }

    getStringConverters() {
        this.strConverters.fr.push(...this.strConverters.all);
        this.strConverters.la.push(...this.strConverters.all);
        return [
            ...this.buildConverters(this.strConverters.la, "la"),
            ...this.buildConverters(this.strConverters.fr, "fr"),
        ];
    }
}
