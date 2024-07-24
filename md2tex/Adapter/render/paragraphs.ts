import { Render } from "../../Render/Render.i";
import {
    Lesson,
    ParagraphLettrine,
    ParagraphStd,
    Rubric,
} from "../../Types/paragraphs";
import { Adapter } from "../Adapter.i";

export const renderParagraphStdTRAD = ({ engine }: Adapter) =>
    function ({ text, translation }: ParagraphStd) {
        return engine.container(
            "tradColonnes",
            engine.join([
                engine.orphan("colLA", {
                    content: text,
                }),
                engine.orphan("colFR", { content: translation }),
            ])
        );
    };

export const renderParagraphLettrine = ({ engine }: Adapter) =>
    function ({ text }: ParagraphLettrine): string {
        return engine.container("paragraphLettrine", text.slice(1), {
            initial: text[0] || "",
        });
    };

export const renderRubric = ({ engine }: Adapter) =>
    function ({ text }: Rubric): string {
        return engine.container("rubric", text);
    };

export const renderRubricTRAD = ({ engine }: Adapter) =>
    function ({ translation }: Rubric): string {
        return engine.container("rubric", fr(engine, translation));
    };

export const renderLesson = (adapter: Adapter) =>
    function ({ text }: Lesson): string {
        return adapter.engine.container(
            "lesson",
            adapter.render(new ParagraphLettrine(text))
        );
    };

export const renderLessonTRAD = (adapter: Adapter) =>
    function ({ text, translation }: Lesson): string {
        return adapter.engine.container(
            "tradColonnes",
            adapter.engine.join([
                adapter.engine.orphan("colLA", {
                    content: adapter.render(new ParagraphLettrine(text)),
                }),
                adapter.engine.orphan("colFR", { content: translation }),
            ])
        );
    };

export function fr(engine: Render, text: string): string {
    return engine.orphan("frenchpar", { content: text });
}
