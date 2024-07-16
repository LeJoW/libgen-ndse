import { Render } from "../Render/Render.i";

export const renderDayTitle = (engine: Render) =>
    function (title: string, dayClass: string | null, short: string): string {
        return engine.orphan("dayTitle", {
            title,
            dayClass: dayClass || "",
            short,
        });
    };

export const renderOfficeTitle = (engine: Render) =>
    function (title: string, anchor: string | null, short: string): string {
        return engine.concat([
            anchor ? engine.orphan("anchor", { href: anchor }) : undefined,
            engine.orphan("officeTitle", {
                title,
                short,
            }),
        ]);
    };

export const renderLessonTitle = (engine: Render) =>
    function (title: string, ref: string | null): string {
        return engine.orphan("lessonTitle", {
            title,
            ref: ref || "",
        });
    };

export const renderPsalmTitle = (engine: Render) =>
    function (title: string): string {
        return engine.orphan("psalmTitle", { title });
    };

export const renderTitle = (engine: Render) =>
    function (title: string): string {
        return engine.orphan("sectionTitle", { title });
    };
