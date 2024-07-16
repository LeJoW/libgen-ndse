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
import { Antiphona, Cantus, Hymnus, Responsorium } from "../Types/Cantus";
import { Canticum, Psalmus, Psalterium } from "../Types/Psalterium";
import { GenericElement } from "../Types/GenericElement";
import { GregoIndex } from "../Types/GregoIndex";
import { incipits } from "./incipits";

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
                let cantus = new Cantus(file);

                if (matches !== null) {
                    const [, ton, type, title] = matches as string[];

                    switch (type) {
                        case "ant":
                            cantus = new Antiphona(file);
                            gregoIndex.addAntiphona(cantus);
                            break;
                        case "hymn":
                            cantus = new Hymnus(file);
                            gregoIndex.addHymnus(cantus);
                            break;
                        case "resp":
                            cantus = new Responsorium(file);
                            gregoIndex.addResponsorium(cantus);
                            break;
                    }
                    cantus.mode = parseInt(ton);
                    cantus.incipit = title;
                }

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
                    .reduce(function (
                        acc: Psalterium,
                        psalmDesc: string
                    ): Psalterium {
                        const [, psalmDescription, title] = psalmDesc.match(
                            /^\s*(\S+?)\s*(?::\s*(.+))?\s*$/
                        ) as string[];
                        const isDoxologie = /G$/.test(psalmDescription);
                        const psalm = isDoxologie
                            ? psalmDescription.slice(0, -1)
                            : psalmDescription;
                        const PsalmConstructor = /\d/.test(psalm)
                            ? Psalmus
                            : Canticum;
                        const psalmus = new PsalmConstructor(
                            ton.length > 0 ? ton : null,
                            psalm,
                            psBuilder
                        );
                        psalmus.doxologie = isDoxologie;
                        psalmus.title =
                            title && title.length > 0 ? title : false;
                        psalmus.incipit = incipits[psalm] ?? undefined;
                        psalmus instanceof Canticum
                            ? gregoIndex.addCanticum(psalmus)
                            : gregoIndex.addPsalmus(psalmus);
                        acc.addPsalm(psalmus);
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
