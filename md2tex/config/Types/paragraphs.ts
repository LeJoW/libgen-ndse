import { TypeConfig } from "../../Rules/Rules.i";
import { Lesson, RemplacementRubric, Rubric } from "../../Types/paragraphs";
import { TextNode } from "../blocks";

export const rubricConfig: TypeConfig = {
    test: /^>{1}\s+([\s\S]+)/,
    callback: function rubrique(_, text): Rubric {
        const rubric = new Rubric(new TextNode(text.replace(/>/g, " ")));
        rubric.text.context = rubric;
        return rubric;
    },
    saveTranslation(rubric: Rubric, trad: string) {
        rubric.text.fr = trad;
    },
};

export const remplacementConfig: TypeConfig = {
    test: /^=>\s+([\S\s]+)/,
    callback: function remplacement(_, text): RemplacementRubric {
        const rrubric = new RemplacementRubric(new TextNode(text));
        rrubric.text.context = rrubric;
        return rrubric;
    },
    saveTranslation(rubric: RemplacementRubric, trad: string) {
        rubric.text.fr = trad;
    },
};

export const lectioConfig: TypeConfig = {
    test: /^:+\s*([\S\s]+)$/,
    callback: function lecture(_, text): Lesson {
        const lesson = new Lesson(new TextNode(text));
        lesson.text.context = lesson;
        return lesson;
    },
    saveTranslation: function (lesson: Lesson, trad: string) {
        lesson.text.fr = trad;
    },
};
