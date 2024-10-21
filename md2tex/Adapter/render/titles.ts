import { Render } from "../../Render/Render.i";
import {
    DayTitle,
    LessonTitle,
    OfficeTitle,
    PsalmTitle,
    Title,
} from "../../Types/titles";
import { Adapter } from "../Adapter.i";

export const renderDayTitle = ({ engine }: Adapter) =>
    function ({ content, dayClass, shortTitle }: DayTitle): string {
        return printDayTitle(
            engine,
            content.la,
            dayClass ? dayClass.la : null,
            shortTitle.la
        );
    };

export const renderDayTitleTRAD = ({ engine }: Adapter) =>
    function ({ content, dayClass, shortTitle }: DayTitle): string {
        return printDayTitle(
            engine,
            content.fr ? content.fr : content.la,
            dayClass && dayClass.fr ? dayClass.fr : null,
            shortTitle.fr ? shortTitle.fr : shortTitle.la
        );
    };

export const renderOfficeTitle = ({ engine }: Adapter) =>
    function ({ content, anchor, shortTitle }: OfficeTitle): string {
        return printOfficeTitle(engine, content.la, anchor, shortTitle.la);
    };

export const renderOfficeTitleTRAD = ({ engine }: Adapter) =>
    function ({ content, anchor, shortTitle }: OfficeTitle): string {
        return printOfficeTitle(
            engine,
            content.fr ? content.fr : content.la,
            anchor,
            shortTitle.fr ? shortTitle.fr : shortTitle.la
        );
    };

export const renderLessonTitle = ({ engine }: Adapter) =>
    function ({ content, addendum }: LessonTitle): string {
        return engine.orphan("lessonTitle", {
            content: content.la,
            ref: addendum?.la ?? "",
        });
    };

export const renderLessonTitleTRAD = ({ engine }: Adapter) =>
    function ({ addendum, content }: LessonTitle): string {
        return engine.orphan("lessonTitle", {
            translation: content.fr,
            ref: addendum?.la ?? "",
        });
    };

export const renderPsalmTitle = ({ engine }: Adapter) =>
    function ({ content }: PsalmTitle): string {
        return engine.orphan("psalmTitle", { title: content.la });
    };

export const renderPsalmTitleTRAD = ({ engine }: Adapter) =>
    function ({ content }: PsalmTitle): string {
        return engine.orphan("psalmTitle", { title: content.fr });
    };

export const renderTitle = ({ engine }: Adapter) =>
    function ({ content }: Title): string {
        return engine.orphan("sectionTitle", { title: content.la });
    };

export const renderTitleTRAD = ({ engine }: Adapter) =>
    function ({ content }: Title): string {
        return engine.orphan("sectionTitle", {
            title: content.fr,
        });
    };

function printDayTitle(
    engine: Render,
    title: string,
    dayClass: string | null,
    short: string
): string {
    return engine.orphan("dayTitle", {
        title,
        dayClass: dayClass || "",
        short,
    });
}

function printOfficeTitle(
    engine: Render,
    title: string,
    anchor: string | null,
    shortTitle: string
): string {
    return engine.concat([
        anchor ? engine.orphan("anchor", { href: anchor }) : undefined,
        engine.orphan("officeTitle", {
            title,
            short: shortTitle,
        }),
    ]);
}
