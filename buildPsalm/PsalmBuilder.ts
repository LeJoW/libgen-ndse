import { Syllabifier } from "./Syllabifier.i";
import { tonType, tons } from "./tons";

type syllabSelection = { before: string[]; accent: string; after: string[] };

export class PsalmBuilder {
    syllabifier: Syllabifier;
    symbols = { cross: " +", star: " \\*" };
    styles = {
        italic: (text: string) => `*${text}*`,
        bold: (text: string) => `**${text}**`,
    };
    accentuation: { [key: string]: string } = {
        a: "á",
        e: "é",
        i: "í",
        o: "ó",
        u: "ú",
        y: "ý",
        æ: "ǽ",
        œ: "œ́",
        au: "áu",
        iu: "íu",
    };

    constructor(syllabifier: Syllabifier) {
        this.syllabifier = syllabifier;
    }

    buildPsalm(verses: string[][], ton: string): string[] {
        if (tons[ton] === undefined) {
            throw new Error(`The ton '${ton}' is not configured.`);
        }
        const tonConfig = tons[ton];
        return verses.map((verse) => this.setUpVerse(verse, tonConfig));
    }

    setUpVerse(verse: string[], { mediante, end }: tonType): string {
        if (verse.length < 2) {
            throw new Error("A verse must contain at least two elements.");
        }
        const protase = verse.slice(0, -2).join(" ");
        const [apex, appodose] = verse.slice(-2);
        return [
            protase + (protase.length > 0 ? this.symbols.cross : ""),
            this.setUpHalfVerse(apex, mediante) + this.symbols.star,
            this.setUpHalfVerse(appodose, end),
        ]
            .join(" ")
            .trim();
    }

    setUpHalfVerse(
        halfVerse: string,
        [preparationSyllabsCount, accents, isAnticipated = false]: [
            number,
            number,
            boolean?
        ]
    ): string {
        const rec = (
            output: string,
            accentsLeft: number,
            before: string[]
        ): string => {
            if (accentsLeft > 0 && before.length >= 2) {
                let { before: newBefore, accent, after } = this.getLastAccent(
                    before
                );
                if (
                    isAnticipated &&
                    accentsLeft === accents &&
                    after.length > 1
                ) {
                    const postTonic = after[0];
                    accent += postTonic;
                    after = after.slice(1);
                }
                return rec(
                    this.setUpPostTonicSyllabs({ before, accent, after }) +
                        output,
                    accentsLeft - 1,
                    newBefore
                );
            }
            return (
                this.setUpPreparationSyllabs(before, preparationSyllabsCount) +
                output
            );
        };

        const syllabs = this.syllabifier.getSyllabsOf(halfVerse + " ");
        return rec("", accents, syllabs).trim();
    }

    isSpirit({ before, accent, after }: syllabSelection): boolean {
        return (
            this.isAccentuatedSyllab(accent) ||
            (!this.isLastSyllab(accent) && this.isLastSyllab(after[0] ?? "")) ||
            (this.isLastSyllab(before[before.length - 1] ?? "") &&
                this.isLastSyllab(accent))
        );
    }

    accentuate(syllab: string): string {
        if (this.isAccentuatedSyllab(syllab)) {
            return syllab;
        }
        return syllab.replace(
            /([æœaeiouy]+)/,
            (_, vowels: string): string => this.accentuation[vowels] ?? vowels
        );
    }

    getLastAccent(syllabs: string[]): syllabSelection {
        const syllab1 = syllabs.pop();
        const syllab2 = syllabs.pop();

        if (syllab1 === undefined || syllab2 === undefined) {
            throw new Error("This verse is too short");
        }

        const output = {
            before: syllabs,
            accent: syllab2,
            after: [syllab1],
        };

        if (this.isFalseAccent(output)) {
            return this.shiftSyllabsRight(output);
        }
        return output;
    }

    private setUpPostTonicSyllabs({
        before,
        accent,
        after,
    }: syllabSelection): string {
        if (this.isSpirit({ before, accent, after })) {
            accent = this.accentuate(accent);
        }
        return this.setSyllabStyle(accent, this.styles.bold) + after.join("");
    }

    private setUpPreparationSyllabs(
        versePart: string[],
        preparationSyllabsCount: number
    ): string {
        if (preparationSyllabsCount === 0) {
            return versePart.join("");
        }
        const roman = versePart.slice(0, -preparationSyllabsCount).join("");
        const italic = versePart.slice(-preparationSyllabsCount).join("");
        return roman + this.setSyllabStyle(italic, this.styles.italic);
    }

    private isFalseAccent({ before, accent, after }: syllabSelection): boolean {
        const beforeReversed = before.reduce(function (
            acc: string[],
            item: string
        ) {
            return [item, ...acc];
        },
        []);
        return (
            beforeReversed.length !== 0 &&
            !this.isLastSyllab(beforeReversed[0]) &&
            (this.isAccentuatedSyllab(beforeReversed[0]) ||
                (/[A-Z]/.test(beforeReversed[0]) &&
                    !this.isAccentuatedSyllab(accent)) ||
                ((beforeReversed.length === 1 ||
                    this.isLastSyllab(beforeReversed[1])) &&
                    this.isLastSyllab(accent)))
        );
    }

    private isLastSyllab(syllab: string): boolean {
        return /\s$/.test(syllab);
    }

    private isAccentuatedSyllab(syllab: string): boolean {
        return /[áéíóúýǽœ́]/i.test(syllab);
    }

    private shiftSyllabsRight({
        before,
        accent,
        after,
    }: syllabSelection): syllabSelection {
        const trueAccent = before.pop();
        if (trueAccent === undefined) {
            throw new Error(
                "This selection cannot be empty before accent to shift right."
            );
        }
        return {
            before: before,
            accent: trueAccent,
            after: [accent, ...after],
        };
    }

    private setSyllabStyle(
        syllab: string,
        style: (text: string) => string
    ): string {
        return syllab.replace(/([\wáéíóúýǽæœ́œ]+)/gi, (_, syllab) =>
            style(syllab)
        );
    }
}
