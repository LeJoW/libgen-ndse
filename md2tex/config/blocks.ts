import { BlockConfigType } from "../Rules/Rules.i";
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
import { PsalmManager } from "../Adapter/PsalmManager/PsalmManager.i";
import { GregError } from "../Types/GregError";

const gregoIndex = new GregoIndex();
const table = new TableOfContents();

const blockConfig = (psalmManager: PsalmManager): BlockConfigType => ({
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
                trad: string,
                mask: RegExp
            ) {
                trad = `########### ${trad}`;
                if (!mask.test(trad)) {
                    return;
                }
                const [, , title, summary, subTitle] = trad.match(
                    mask
                ) as string[];
                if (titreElement instanceof DayTitle && mask.test(trad)) {
                    titreElement.setTranslation({
                        title,
                        dayClass: subTitle,
                        shortTitle:
                            summary && summary.length > 0 ? summary : title,
                    });
                } else if (titreElement instanceof OfficeTitle) {
                    titreElement.setTranslation({
                        title,
                        shortTitle:
                            summary && summary.length > 0 ? summary : title,
                    });
                } else {
                    titreElement.setTranslation(title);
                }
            },
        },
        {
            test: /^>{1}\s+([\s\S]+)/,
            callback: function rubrique(_, text) {
                return new Rubric(text.replace(/>/g, " "));
            },
            saveTranslation(rubric, trad: string) {
                rubric.setTranslation(trad);
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
            callback(_, label, file) {
                const matches = label.match(/(?:([1-8pi]+):)?(\w+):(.+)/);
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
                    cantus.ton = ton;
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
            callback(_, ton, psaumes): Psalterium {
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
                            ton.length > 0 && ton != "0" ? ton : null,
                            psalm
                        );
                        psalmManager.setUpPsalm(psalmus);
                        psalmus.doxologie = isDoxologie;
                        psalmus.title =
                            title && title.length > 0
                                ? new PsalmTitle(title)
                                : false;
                        psalmus.incipit = incipits[psalm] ?? undefined;
                        psalmus instanceof Canticum
                            ? gregoIndex.addCanticum(psalmus)
                            : gregoIndex.addPsalmus(psalmus);
                        acc.addPsalm(psalmus);
                        return acc;
                    },
                    new Psalterium(ton.length > 0 && ton != "0" ? ton : null));
            },
            saveTranslation(psalterium, trad) {
                trad.split(";;").map(function (title: string, index: number) {
                    title = title.trim();
                    if (title.length > 0) {
                        psalterium.translation = true;
                        (psalterium as Psalterium).psalms[index].setTranslation(
                            title
                        );
                    }
                });
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
