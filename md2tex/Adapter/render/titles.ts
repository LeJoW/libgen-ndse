import { Render } from "../../Render/Render.i";
import {
    DayTitle,
    LessonTitle,
    OfficeTitle,
    PsalmTitle,
    Title,
} from "../../Types/titles";
import { Adapter } from "../Adapter.i";
import { fr } from "./paragraphs";

export const renderDayTitle = ({ engine }: Adapter) =>
    function ({ title, dayClass, shortTitle }: DayTitle): string {
        return printDayTitle(engine, title, dayClass, shortTitle);
    };

export const renderDayTitleTRAD = ({ engine }: Adapter) =>
    function ({
        translation,
    }: {
        translation: Exclude<DayTitle["translation"], false>;
    }): string {
        return printDayTitle(
            engine,
            fr(engine, translation.title),
            translation.dayClass,
            fr(engine, translation.shortTitle ?? translation.title)
        );
    };

export const renderOfficeTitle = ({ engine }: Adapter) =>
    function ({ title, anchor, shortTitle }: OfficeTitle): string {
        return printOfficeTitle(engine, title, anchor, shortTitle);
    };

export const renderOfficeTitleTRAD = ({ engine }: Adapter) =>
    function ({
        anchor,
        translation,
    }: Omit<OfficeTitle, "translation"> & {
        translation: Exclude<OfficeTitle["translation"], false>;
    }): string {
        return printOfficeTitle(
            engine,
            fr(engine, translation.title),
            anchor,
            fr(engine, translation.shortTitle)
        );
    };

export const renderLessonTitle = ({ engine }: Adapter) =>
    function ({ title, addendum }: LessonTitle): string {
        return engine.orphan("lessonTitle", {
            title,
            ref: addendum ?? "",
        });
    };

export const renderLessonTitleTRAD = ({ engine }: Adapter) =>
    function ({ addendum, translation }: LessonTitle): string {
        return engine.orphan("lessonTitle", {
            translation: fr(engine, translation),
            ref: addendum ?? "",
        });
    };

export const renderPsalmTitle = ({ engine }: Adapter) =>
    function ({ title }: PsalmTitle): string {
        return engine.orphan("psalmTitle", { title });
    };

export const renderPsalmTitleTRAD = ({ engine }: Adapter) =>
    function ({ translation }: PsalmTitle): string {
        return engine.orphan("psalmTitle", { title: fr(engine, translation) });
    };

export const renderTitle = ({ engine }: Adapter) =>
    function ({ title }: Title): string {
        return engine.orphan("sectionTitle", { title });
    };

export const renderTitleTRAD = ({ engine }: Adapter) =>
    function ({ translation }: Title): string {
        return engine.orphan("sectionTitle", {
            title: fr(engine, translation),
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
