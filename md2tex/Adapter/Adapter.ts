import { GenericElement } from "../Types/GenericElement";
import { Adapter as AdapterInterface } from "./Adapter.i";
import { Render } from "../Render/Render.i";
import {
    DayTitle,
    LessonTitle,
    OfficeTitle,
    PsalmTitle,
    Title,
} from "../Types/titles";
import { Psalmus, Psalterium } from "../Types/Psalterium";
import { Cantus } from "../Types/Cantus";
import { Lesson, ParagraphLettrine, Rubric } from "../Types/paragraphs";
import { TableOfContents } from "../Types/TableOfContents";
import {
    renderDayTitle,
    renderLessonTitle,
    renderOfficeTitle,
    renderPsalmTitle,
    renderTitle,
} from "./render/titles";
import { renderPsalmus, renderPsalterium } from "./render/psalterium";
import {
    renderLesson,
    renderParLettrine,
    renderRubric,
} from "./render/paragraphs";
import { renderCantus } from "./render/cantus";
import { renderTableOfContents } from "./render/tableOfContents";

export class Adapter implements AdapterInterface {
    translation: boolean = false;
    engine: Render;
    symbols: {
        star: string;
        cross: string;
        nbsp: string;
        ampersand: string;
        parnumber: string;
    };
    chars = {
        italic: (text: string) => this.engine.orphan("italic", { value: text }),
        bold: (text: string) => this.engine.orphan("bold", { value: text }),
        roman: (text: string) => this.engine.orphan("roman", { value: text }),
    };

    constructor(render: Render) {
        this.engine = render;
        this.symbols = {
            star: this.engine.orphan("gstella"),
            cross: this.engine.orphan("gcrux"),
            ampersand: this.engine.orphan("ampersand"),
            nbsp: this.engine.symbol("nbsp"),
            parnumber: this.engine.orphan("forcebreak"),
        };
    }

    render(element: GenericElement): string {
        if (element instanceof DayTitle) {
            return this.renderDayTitle(
                element.title,
                element.dayClass,
                element.shortTitle
            );
        } else if (element instanceof OfficeTitle) {
            return this.renderOfficeTitle(
                element.title,
                element.anchor,
                element.shortTitle
            );
        } else if (element instanceof LessonTitle) {
            return this.renderLessonTitle(element.title, element.addendum);
        } else if (element instanceof PsalmTitle) {
            return this.renderPsalmTitle(element.title);
        } else if (element instanceof Title) {
            return this.renderTitle(element.title);
        } else if (element instanceof Psalterium) {
            return this.renderPsalterium(element.intonation, element.psalms);
        } else if (element instanceof Psalmus) {
            return this.renderPsalmus(element);
        } else if (element instanceof ParagraphLettrine) {
            return this.renderParLettrine(element.text);
        } else if (element instanceof Cantus) {
            return this.renderCantus(element.scorePath, element.anchor);
        } else if (element instanceof Rubric) {
            return this.renderRubric(element.text);
        } else if (element instanceof Lesson) {
            return this.renderLesson(element.text);
        } else if (element instanceof TableOfContents) {
            return this.renderTableOfContents(element.contents);
        } else {
            return element.content;
        }
    }

    private renderDayTitle = (() => renderDayTitle(this.engine))();
    private renderOfficeTitle = (() => renderOfficeTitle(this.engine))();
    private renderLessonTitle = (() => renderLessonTitle(this.engine))();
    private renderPsalmTitle = (() => renderPsalmTitle(this.engine))();
    private renderTitle = (() => renderTitle(this.engine))();

    private renderCantus = (() => renderCantus(this.engine))();

    private renderPsalmus = (() => renderPsalmus(this))();
    private renderPsalterium = (() => renderPsalterium(this))();

    private renderParLettrine = (() => renderParLettrine(this.engine))();
    private renderRubric = (() => renderRubric(this.engine))();
    private renderLesson = (() => renderLesson(this.engine))();

    private renderTableOfContents = (() =>
        renderTableOfContents(this.engine))();
}
