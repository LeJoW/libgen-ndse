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
    function ({ title, dayClass, shortTitle }: DayTitle): string {
        return printDayTitle(engine, title, dayClass, shortTitle);
    };

export const renderOfficeTitle = ({ engine }: Adapter) =>
    function ({ title, anchor, shortTitle }: OfficeTitle): string {
        return engine.concat([
            anchor ? engine.orphan("anchor", { href: anchor }) : undefined,
            engine.orphan("officeTitle", {
                title,
                short: shortTitle,
            }),
        ]);
    };

export const renderLessonTitle = ({ engine }: Adapter) =>
    function ({ title, addendum }: LessonTitle): string {
        return engine.orphan("lessonTitle", {
            title,
            ref: addendum ?? "",
        });
    };

export const renderPsalmTitle = ({ engine }: Adapter) =>
    function ({ title }: PsalmTitle): string {
        return engine.orphan("psalmTitle", { title });
    };

export const renderTitle = ({ engine }: Adapter) =>
    function ({ title }: Title): string {
        return engine.orphan("sectionTitle", { title });
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
