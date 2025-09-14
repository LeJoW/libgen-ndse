import { Render } from "../../Render/Render.i";
import {
    Lesson,
    ParagraphLettrine,
    ParagraphStd,
    RemplacementRubric,
    Rubric,
} from "../../Types/paragraphs";
import { TextNode } from "../../Types/TextNode.i";
import { Adapter } from "../Adapter.i";

export const renderParagraphStd = () =>
    function ({ text }: ParagraphStd) {
        return text.la.trim();
    };

export const renderParagraphStdTRAD = ({ engine }: Adapter) =>
    function ({ text }: ParagraphStd) {
        return printParagraphStdTRAD(text, engine);
    };

export const renderParagraphLettrine = ({ engine }: Adapter) =>
    function ({ text }: ParagraphLettrine): string {
        return printParagraphLettrine(text.la, engine);
    };

export const renderRubric = ({ engine }: Adapter) =>
    function ({ text }: Rubric): string {
        return engine.container("rubric", text.la);
    };

export const renderRubricTRAD = ({ engine }: Adapter) =>
    function ({ text }: Rubric): string {
        return engine.container("rubric", text.fr);
    };

export const renderLesson = ({ engine }: Adapter) =>
    function ({ text }: Lesson): string {
        return engine.container(
            "lesson",
            printParagraphLettrine(text.la, engine)
        );
    };

export const renderLessonTRAD = ({ engine }: Adapter) =>
    function ({ text }: Lesson): string {
        return engine.container(
            "lesson",
            printParagraphStdTRAD(
                {
                    la: printParagraphLettrine(text.la, engine),
                    fr: text.fr,
                } as TextNode,
                engine
            )
        );
    };

export const renderRemplacementRubric = ({ engine }: Adapter) =>
    function ({ text }: RemplacementRubric): string {
        return engine.container("remplacement", text.la);
    };
export const renderRemplacementRubricTRAD = ({ engine }: Adapter) =>
    function ({ text }: RemplacementRubric): string {
        return engine.container("remplacement", text.fr);
    };

function printParagraphLettrine(text: string, engine: Render): string {
    return engine.container("paragraphLettrine", text.slice(1), {
        initial: text[0] || "",
    });
}

function printParagraphStdTRAD({ la, fr }: TextNode, engine: Render): string {
    return engine.container(
        "tradColonnes",
        engine.orphan("colonneTRAD", { la, fr })
    );
}
