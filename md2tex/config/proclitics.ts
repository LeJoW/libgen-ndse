import { default as proclitics } from "./proclitics-list";

export function removeProcliticsAccents(text: string): string {
    return text
        .split(/\s/)
        .map(function (word: string): string {
            if (detectProclitic(word)) {
                return removeAccents(word);
            }
            return word;
        })
        .join(" ");
}

function detectProclitic(str: string): boolean {
    return isProclitic(removeAccents(trimWord(str)).toLowerCase());
}

function isProclitic(word: string): boolean {
    return proclitics.includes(word);
}

function trimWord(str: string): string {
    return str.replace(/([^a-záéíóúýǽœ́æœ])/gi, "");
}

const diacritics = (function (list) {
    return {
        ...list,
        ...Object.entries(list).reduce(function (
            acc,
            [withAccent, withoutAccent]
        ) {
            return {
                ...acc,
                [withAccent.toUpperCase()]: withoutAccent.toUpperCase(),
            };
        },
        {}),
    };
})({
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    ý: "y",
    ǽ: "æ",
    œ́: "œ",
});
function removeAccents(str: string): string {
    return str.replace(/([áéíóúýǽœ́])/i, function (char) {
        return diacritics[char as keyof typeof diacritics] || char;
    });
}

export const testFunctions = { trimWord, detectProclitic, removeAccents };
