import { BlockConfigType } from "../Rules/Rules.i";
import { PsalmBuilder } from "../../buildPsalm/PsalmBuilder";
import { TableOfContents } from "../Types/TableOfContents";
import {
    DayTitle,
    LessonTitle,
    OfficeTitle,
    PsalmTitle,
    SectionTitle,
} from "../Types/titles";
import {
    Lesson,
    ParagraphStd,
    RemplacementRubric,
    Rubric,
} from "../Types/paragraphs";
import { Cantus } from "../Types/Cantus";
import { Psalmus, Psalterium } from "../Types/Psalterium";
import { GenericElement } from "../Types/GenericElement";
import { GregoIndex } from "../Types/GregoIndex";

const gregoIndex = new GregoIndex();
const table = new TableOfContents();

const blockConfig = (psBuilder: PsalmBuilder): BlockConfigType => ({
    desc: [
        {
            test: /^(#+)\s+([\S\s]+?)\s*(?:<([\S\s]+?)>)?\s*(?:\{([\S\s]+?)\})?\s*$/i,
            callback: function titre(
                _,
                titleLevel,
                title,
                summary = "",
                subTitle = ""
            ) {
                switch (titleLevel) {
                    case "##":
                        const dayTitle = new DayTitle(title);
                        dayTitle.dayClass = subTitle;
                        if (summary.length > 0) {
                            dayTitle.shortTitle = summary;
                        }
                        table.addDay(dayTitle);
                        return dayTitle;
                    case "###":
                        const officeTitle = new OfficeTitle(title);
                        if (summary.length > 0) {
                            officeTitle.shortTitle = summary;
                        }
                        table.addOffice(officeTitle);
                        return officeTitle;
                    case "####":
                        const lessonTitle = new LessonTitle(title);
                        lessonTitle.addendum = subTitle;
                        return lessonTitle;
                    case "#####":
                        return new PsalmTitle(title);
                    default:
                        return new SectionTitle(title);
                }
            },
            saveTranslation: function (
                titreElement: GenericElement,
                trad: string
            ) {
                if (titreElement instanceof DayTitle) {
                    const matches = trad.split("|");
                    if (matches.length === 3) {
                        titreElement.setTranslation({
                            title: matches[0],
                            dayClass: matches[2],
                            short: matches[1],
                        });
                    }
                }
            },
        },
        {
            test: /^>{1}\s+([\s\S]+)/,
            callback: function rubrique(_, text) {
                return new Rubric(text.replace(/>/g, " "));
            },
        },
        {
            test: /^(?:&>){1}\s+([\s\S]+)/,
            callback: function remplacement(_, text) {
                return new RemplacementRubric(text);
            },
        },
        {
            test: /^:+\s*([\S\s]+)$/,
            callback: function lecture(_, text) {
                return new Lesson(text);
            },
            saveTranslation: function (lesson, trad: string) {
                lesson.setTranslation(trad);
            },
        },
        {
            test: /^!\[(.*)\]\(([\S]+)\)$/,
            callback: function gabc(_, label, file) {
                const matches = label.match(/(?:(\d+):)?(\w+):(.+)/);
                const cantus = new Cantus(file);
                if (matches !== null) {
                    const [, ton, type, title] = matches as string[];
                    cantus.type = type;
                    cantus.mode = parseInt(ton);
                    cantus.incipit = title;
                }
                gregoIndex.addCantus(cantus);
                return cantus;
            },
            saveTranslation: function (cantus, trad) {
                cantus.setTranslation(trad);
            },
        },
        {
            test: /^@(?:\((\S+)\))?\[([\S\s]+)\]/,
            callback: function psautier(_, ton, psaumes) {
                return psaumes
                    .split(";;")
                    .filter(function () {
                        return true;
                    })
                    .map(function (psalmDesc): Psalmus {
                        const [, psalmDescription, title] = psalmDesc.match(
                            /^\s*(\S+?)\s*(?::\s*(.+))?\s*$/
                        ) as string[];
                        const isDoxologie = /G$/.test(psalmDescription);
                        const psalm = isDoxologie
                            ? psalmDescription.slice(0, -1)
                            : psalmDescription;
                        const psalmus = new Psalmus(
                            ton.length > 0 ? ton : null,
                            psalm,
                            psBuilder
                        );
                        psalmus.doxologie = isDoxologie;
                        psalmus.title =
                            title && title.length > 0 ? title : false;
                        gregoIndex.addPsalm(psalmus);
                        return psalmus;
                    })
                    .reduce(function (
                        acc: Psalterium,
                        psalm: Psalmus
                    ): Psalterium {
                        acc.addPsalm(psalm);
                        return acc;
                    },
                    new Psalterium(ton.length > 0 ? ton : null));
            },
        },
        {
            test: /<\s*(\S+)\s*\/>/,
            callback: function (_, tag) {
                switch (tag) {
                    case "grego-index":
                        return gregoIndex;
                    case "table-of-contents":
                        return table;
                    default:
                        return new GenericElement(tag);
                }
            },
        },
    ],
    defaultCase: function (paragraph: string) {
        return new ParagraphStd(paragraph);
    },
});

export default blockConfig;
