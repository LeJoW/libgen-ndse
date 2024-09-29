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

export const renderParagraphStdTRAD = ({ engine }: Adapter) =>
    function ({ text }: ParagraphStd) {
        return printParagraphStdTRAD(text, engine);
    };

export const renderParagraphLettrine = ({ engine }: Adapter) =>
    function ({ text }: ParagraphLettrine): string {
        return engine.container("paragraphLettrine", text.la.slice(1), {
            initial: text.la[0] || "",
        });
    };

export const renderRubric = ({ engine }: Adapter) =>
    function ({ text }: Rubric): string {
        return engine.container("rubric", text);
    };

export const renderRubricTRAD = ({ engine }: Adapter) =>
    function ({ text }: Rubric): string {
        return engine.container("rubric", text.fr);
    };

export const renderLesson = (adapter: Adapter) =>
    function ({ text }: Lesson): string {
        return adapter.engine.container(
            "lesson",
            adapter.render(new ParagraphLettrine(text))
        );
    };

export const renderLessonTRAD = ({ engine }: Adapter) =>
    function ({ text }: Lesson): string {
        return engine.container("lesson", printParagraphStdTRAD(text, engine));
    };

export const renderRemplacementRubric = ({ engine }: Adapter) =>
    function ({ text }: RemplacementRubric): string {
        return engine.container("remplacement", text);
    };

function printParagraphStdTRAD({ la, fr }: TextNode, engine: Render): string {
    return engine.container(
        "tradColonnes",
        engine.join([
            engine.orphan("colFR", { content: fr }),
            engine.orphan("colLA", {
                content: la,
            }),
        ])
    );
}
