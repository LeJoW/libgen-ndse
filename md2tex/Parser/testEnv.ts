import { preprocess } from "../config/preprocess";
import { translate } from "../config/translation";
import { Rules } from "../Rules/Rules";
import { GenericElement } from "../Types/GenericElement";
import { Adapter } from "../Adapter/Adapter";
import { TexRender } from "../Render/TexRender";

export const adapter = new Adapter(new TexRender());
adapter.textStyles.bold = function (text) {
    return `[${text}]`;
};
adapter.textStyles.italic = function (text) {
    return `(${text})`;
};
adapter.symbols.cross = " +";
adapter.symbols.star = " *";
adapter.render = function (element: parStd | Title) {
    return (
        (this.translation && element.translation
            ? `trad: ${element.translation}\n`
            : "") +
        `${element.label}: ` +
        element.content
    );
};

class parStd extends GenericElement {
    label = "std";
}
class Title extends GenericElement {
    label = "title";
}

export const id = (b: string) => new parStd(b);
export const title = (_: string, b: string) => new Title(b);
const saveTranslationDefault = function (
    element: GenericElement,
    translation: string
) {
    element.setTranslation(translation);
};

export const rules = new Rules(
    {
        desc: [
            {
                test: /^#+\s*(.+)$/,
                callback: title,
                saveTranslation: saveTranslationDefault,
            },
        ],
        defaultCase: id,
    },
    [
        {
            test: /([éá])/g,
            callback: function (_, c) {
                const chars: { [key: string]: string } = {
                    é: "e",
                    á: "a",
                };
                return "\\'" + chars[c];
            },
        },
        {
            test: /\*([\S\s]+)\*/g,
            callback: function (_, text) {
                return `{\\it ${text}}`;
            },
        },
        {
            test: /_{1}([^_]+)_{1}/g,
            callback(_, text) {
                return adapter.textStyles.italic(text);
            },
        },
    ]
);
rules.preprocessor = preprocess;
rules.translater = translate;
