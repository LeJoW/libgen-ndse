import { Render } from "../../Render/Render.i";

export const renderParLettrine = (engine: Render) =>
    function (text: string): string {
        return engine.container("paragraphLettrine", text.slice(1), {
            initial: text[0] || "",
        });
    };

export const renderRubric = (engine: Render) =>
    function (text: string): string {
        return engine.container("rubric", text);
    };

export const renderLesson = (engine: Render) =>
    function (text: string): string {
        return engine.container("lesson", renderParLettrine(engine)(text));
    };
