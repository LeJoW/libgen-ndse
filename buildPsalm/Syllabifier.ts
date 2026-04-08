import { execSync } from "child_process";
import { Syllabifier as SyllabifierInterface } from "./Syllabifier.i";

export class Syllabifier implements SyllabifierInterface {
    hyphenate: (word: string) => string;

    constructor(dicPath: string) {
        this.hyphenate = function (word) {
            return execSync(`echo "${word}" | example ${dicPath} /dev/stdin`)
                .toString()
                .trim();
        };
    }

    getSyllabsOf(sentence: string): string[] {
        return this.rawHyphenate(sentence).split("=");
    }

    rawHyphenate(sentence: string): string {
        const ready = this.prepare(sentence);
        const outList = this.hyphenateArray(ready);
        const listWithContext = Helpers.mergeWithPriority(
            outList,
            ready,
            function (itemb) {
                return /\w/.test(itemb);
            }
        );
        const a = sentence.replace(/\s+/g, " ");
        const b = listWithContext.reduce(function (acc, item, index) {
            return acc + (index > 0 && /\w/.test(item) ? " =" : "") + item;
        }, "");
        return Helpers.mergeWithPriority(
            Helpers.str2array(a),
            Helpers.str2array(b),
            function (y) {
                return y != "=";
            }
        ).join("");
    }

    hyphenateArray(tokenList: string[]): string[] {
        const data = tokenList
            .filter((token: string): boolean => {
                return /\w/.test(token);
            })
            .join("\n");
        return this.hyphenate(data).split("\n");
    }

    prepare(sentence: string): string[] {
        const cleanned = Helpers.removeAccutes(sentence);
        const tokens = Helpers.lowerCase(cleanned);
        return tokens
            .split(/([^\wæœ]+)/)
            .map(function (item: string) {
                return item.trim();
            })
            .filter(function (item: string) {
                return item.length > 0;
            });
    }
}

export const Helpers = {
    removeAccutes: function (input: string): string {
        return input
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .normalize("NFC");
    },
    lowerCase: function (input: string): string {
        return input.toLowerCase();
    },
    str2array: function (input: string): string[] {
        return Array.from(input);
    },
    mergeWithPriority: function (
        a: any[],
        b: any[],
        test: (itemb: any) => boolean
    ): any[] {
        let i = 0;

        return b.reduce(function (acc, item) {
            if (i < a.length && test(item)) {
                acc.push(a[i]);
                i++;
            } else {
                acc.push(item);
            }
            return acc;
        }, []);
    },
};
