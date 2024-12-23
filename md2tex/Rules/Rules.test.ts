import { GenericElement } from "../Types/GenericElement";
import { translate } from "../config/translation";
import { Rules } from "./Rules";

test("block-operators", function () {
    function replaceDefault(input: string): GenericElement {
        return new GenericElement();
    }
    const titleReplace = replaceDefault;
    function accentReplace(_: string): string {
        return "\\'e";
    }

    const engine = new Rules(
        {
            desc: [
                {
                    test: /^#+/,
                    callback: titleReplace,
                },
            ],
            defaultCase: replaceDefault,
        },
        { fr: [], all: [], la: [{ test: /(é)/, callback: accentReplace }] }
    );
    engine.translater = translate;

    expect(engine.getBlockConverter("Lambda text")).toStrictEqual({
        mask: /([\S\s]*)/,
        replace: replaceDefault,
        storeTranslation: expect.any(Function),
    });

    expect(engine.getBlockConverter("# Title text")).toStrictEqual({
        mask: /^#+/,
        replace: titleReplace,
        storeTranslation: expect.any(Function),
    });

    expect(engine.getStringConverters()).toStrictEqual([
        {
            mask: /(é)/,
            replace: accentReplace,
            lang: "la",
        },
    ]);

    expect(engine.getTranslation("")).toStrictEqual({
        block: "",
        translation: false,
    });
    expect(engine.getTranslation("Nothing $rien$")).toStrictEqual({
        block: "Nothing",
        translation: "rien",
    });
});
