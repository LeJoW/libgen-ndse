import { Lesson, ParagraphLettrine, Rubric } from "../../Types/paragraphs";
import { Adapter } from "../Adapter.i";

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

export const renderLesson = (adapter: Adapter) =>
    function ({ text }: Lesson): string {
        return adapter.engine.container(
            "lesson",
            adapter.render(new ParagraphLettrine(text))
        );
    };
