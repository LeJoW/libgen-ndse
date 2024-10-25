const proclitics = ["ád", "ét", "quóniam"];

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
    return isProclitic(trimWord(str));
}

function isProclitic(word: string): boolean {
    return proclitics.includes(word);
}

function trimWord(str: string): string {
    return str.replace(/([^a-záéíóúýǽœ́])/gi, "");
}

const diacritics = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    ý: "y",
    ǽ: "æ",
    œ́: "œ",
};
function removeAccents(str: string): string {
    return str.replace(/([áéíóúýǽœ́])/, function (char) {
        return diacritics[char as keyof typeof diacritics] || char;
    });
}

export const testFunctions = { trimWord, isProclitic };
