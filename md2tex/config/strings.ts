import { StringConfigType } from "../Rules/Rules.i";
import { Adapter } from "../Adapter/Adapter.i";
import { removeProcliticsAccents } from "./proclitics";

const symbols: { [char: string]: keyof Adapter["symbols"] } = {
    "&": "ampersand",
    "§": "parnumber",
    "+": "cross",
    "\\*": "star",
};

const strConfig = (adapter: Adapter): StringConfigType => ({
    la: [
        {
            test: /^([\S\s]*)$/,
            callback: function (_, text) {
                return removeProcliticsAccents(text);
            },
        },
        {
            test: /(quǽsumus)/g,
            callback: function () {
                return "quǽ\\-su\\-mus";
            },
        },
        {
            test: /\s*((\+)|(\\\*))/g,
            callback: function (_, symbol) {
                return (
                    adapter.symbols.nbsp +
                    adapter.symbols[symbols[symbol.trim()]]
                );
            },
        },
    ],
    fr: [],
    all: [
        {
            test: /\*{2}([\S\s]+?)\*{2}/g,
            callback: function (_, text) {
                return adapter.textStyles.bold(text);
            },
        },
        {
            test: /[\*_]{1}([\S\s]+?)[\*_]{1}/g,
            callback: function (_, text) {
                return adapter.textStyles.italic(text);
            },
        },
        {
            test: /\s*(&|§)\s*/g,
            callback: function (_, char) {
                return adapter.symbols[symbols[char]];
            },
        },
        {
            test: /\|([^|]+)\|/g,
            callback(_, text) {
                return adapter.textStyles.smallCaps(text);
            },
        },
        {
            test: /\^(\S+)/g,
            callback(_, text) {
                return adapter.textStyles.upper(text);
            },
        },
    ],
});

export default strConfig;
