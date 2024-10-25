import { preprocess } from "../config/preprocess";
import { translate } from "../config/translation";
import { Rules } from "../Rules/Rules";
import { GenericElement } from "../Types/GenericElement";
import { Adapter } from "../Adapter/Adapter";
import { TexRender } from "../Render/TexRender";
import { TextNode } from "../Types/TextNode";

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
            ? `trad: ${element.content.fr}\n`
            : "") +
        `${element.label}: ` +
        element.content.la
    );
};

class TextElement extends GenericElement {
    content: TextNode;
    constructor(input: TextNode) {
        super();
        this.content = input;
        this.content.context = this;
    }
    setTranslation() {
        this.translation = true;
    }
}

class parStd extends TextElement {
    label = "std";
}
class Title extends TextElement {
    label = "title";
}

export const id = (b: string) => {
    return new parStd(new TextNode(b));
};
export const title = (_: string, b: string) => {
    return new Title(new TextNode(b));
};
const saveTranslationDefault = function (
    element: TextElement,
    translation: string
) {
    element.setTranslation();
    element.content.fr = translation;
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
    {
        fr: [],
        la: [],
        all: [
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
        ],
    }
);
rules.preprocessor = preprocess;
rules.translater = translate;
