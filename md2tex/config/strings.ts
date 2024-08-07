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
        test: /\s*((\+)|(\\\*))/g,
        callback: function (_, symbol) {
            return (
                adapter.symbols.nbsp + adapter.symbols[symbols[symbol.trim()]]
            );
        },
    },
    {
        test: /(_{1}([\S\s]+)_{1})/g,
        callback: function (_, all, text, offset, ctx) {
            if (/^!/.test(ctx)) {
                return all;
            }
            return /^>/.test(ctx)
                ? adapter.textStyles.roman(text)
                : adapter.textStyles.italic(text);
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
