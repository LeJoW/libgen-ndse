import { execSync } from "child_process";
import { GenericElement } from "./GenericElement";

export class Hyphens extends GenericElement {
    words: string[] = [];

    registerString(text: string) {
        text.split(/\s+/).map((word) => this.registerWord(word));
    }

    registerWord(word: string) {
        if (!/^\\/.test(word)) {
            const trimed = trimWord(word).toLowerCase();
            if (!this.words.includes(trimed) && trimed.length > 4) {
                this.words.push(trimed);
            }
        }
    }

    getHyphenatedList(): string[] {
        const list = this.words.join("\n");
        return execSync(
            `echo "${list}" | example tex2pdf/hyphen/hyph_la_VA.dic /dev/stdin`
        )
            .toString()
            .trim()
            .replace(/=/g, "-")
            .split(/[\n\s]+/);
    }
}

function trimWord(str: string): string {
    return str.replace(/([^a-záéíóúýǽœ́æœ])/gi, "");
}
