import { StringConfigType } from "../Rules/Rules.i";
import { Adapter } from "../Adapter/Adapter.i";

const symbols: { [char: string]: keyof Adapter["symbols"] } = {
    "&": "ampersand",
    "§": "parnumber",
    "+": "cross",
    "\\*": "star",
};

const strConfig = (adapter: Adapter): StringConfigType => [
    {
        test: /(?:)/,
        callback: function (_, __, text) {
            return text;
        },
    },
    {
        test: /\s*((\+)|(\\\*))/g,
        callback: function (_, symbol) {
            return (
                adapter.symbols.nbsp + adapter.symbols[symbols[symbol.trim()]]
            );
        },
    },
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
];

export default strConfig;
