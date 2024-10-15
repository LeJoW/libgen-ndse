import { BlockConfigType } from "../Rules/Rules.i";
import { TableOfContents } from "../Types/TableOfContents";
import {
    DayTitle,
    LessonTitle,
    OfficeTitle,
    PsalmTitle,
    SectionTitle,
    Title,
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
import { TextNode } from "../Types/TextNode";

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
            ): Title {
                const titleNode = new TextNode(title);
                const summaryNode = new TextNode(
                    summary.length > 0 ? summary : title
                );
                const subTitleNode = new TextNode(subTitle);
                switch (titleLevel) {
                    case "##":
                        const dayTitle = new DayTitle(titleNode, summaryNode);
                        dayTitle.dayClass = subTitleNode;
                        titleNode.context = dayTitle;
                        summaryNode.context = dayTitle;
                        subTitleNode.context = dayTitle;
                        table.addDay(dayTitle);
                        return dayTitle;
                    case "###":
                        const officeTitle = new OfficeTitle(
                            titleNode,
                            summaryNode
                        );
                        titleNode.context = officeTitle;
                        summaryNode.context = officeTitle;
                        table.addOffice(officeTitle);
                        return officeTitle;
                    case "####":
                        const lessonTitle = new LessonTitle(titleNode);
                        lessonTitle.addendum = subTitleNode;
                        titleNode.context = lessonTitle;
                        subTitleNode.context = lessonTitle;
                        return lessonTitle;
                    case "#####":
                        const psTitle = new PsalmTitle(titleNode);
                        titleNode.context = psTitle;
                        return psTitle;
                    default:
                        const sectionTitle = new SectionTitle(titleNode);
                        titleNode.context = sectionTitle;
                        return sectionTitle;
                }
            },
            saveTranslation: function (
                titreElement: Title,
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
                titreElement.content.fr = title;
                if (titreElement instanceof DayTitle) {
                    if (!titreElement.dayClass) {
                        titreElement.dayClass = new TextNode();
                    }
                    titreElement.dayClass.fr = subTitle;
                    titreElement.shortTitle.fr =
                        summary && summary.length > 0 ? summary : title;
                } else if (titreElement instanceof OfficeTitle) {
                    titreElement.shortTitle.fr =
                        summary && summary.length > 0 ? summary : title;
                }
            },
        },
        {
            test: /^>{1}\s+([\s\S]+)/,
            callback: function rubrique(_, text): Rubric {
                const rubric = new Rubric(
                    new TextNode(text.replace(/>/g, " "))
                );
                rubric.text.context = rubric;
                return rubric;
            },
            saveTranslation(rubric: Rubric, trad: string) {
                rubric.text.fr = trad;
            },
        },
        {
            test: /^=>\s+([\S\s]+)/,
            callback: function remplacement(_, text): RemplacementRubric {
                const rrubric = new RemplacementRubric(new TextNode(text));
                rrubric.text.context = rrubric;
                return rrubric;
            },
        },
        {
            test: /^:+\s*([\S\s]+)$/,
            callback: function lecture(_, text): Lesson {
                const lesson = new Lesson(new TextNode(text));
                lesson.text.context = lesson;
                return lesson;
            },
            saveTranslation: function (lesson: Lesson, trad: string) {
                lesson.text.fr = trad;
            },
        },
        {
            test: /^!\[(.*)\]\(([\S]+)\)$/,
            callback(_, label, file): Cantus {
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
            saveTranslation: function (cantus: Cantus, trad) {
                cantus.text = new TextNode();
                cantus.text.fr = trad;
                cantus.text.context = cantus;
            },
        },
        {
            test: /^@(?:(\d+))?(?:\((\S+)\))?\[([\S\s]+)\]/,
            callback(_, linesTrad, ton, psaumes): Psalterium {
                return psaumes
                    .split(";;")
                    .reduce(function (
                        acc: Psalterium,
                        psalmDesc: string,
                        index: number
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
                        const psalmus = new PsalmConstructor(acc.ton, psalm);
                        const { la, fr } = psalmManager.getPsalm(psalmus);
                        psalmus.versi = la.map(function (
                            verse: string,
                            index: number
                        ): TextNode {
                            const output = new TextNode(verse);
                            output.context = psalmus;
                            if (fr[index]) {
                                output.fr = fr[index] as string;
                            }
                            return output;
                        });
                        psalmus.doxologie = isDoxologie;
                        psalmus.title =
                            title && title.length > 0
                                ? (() => {
                                      const out = new PsalmTitle(
                                          new TextNode(title)
                                      );
                                      out.content.context = out;
                                      return out;
                                  })()
                                : false;
                        psalmus.incipit = incipits[psalm] ?? undefined;
                        psalmus instanceof Canticum
                            ? gregoIndex.addCanticum(psalmus)
                            : gregoIndex.addPsalmus(psalmus);
                        if (index === 0 && acc.ton) {
                            psalmus.intonation = new Cantus(
                                `${psalmus.psalmDivision}-${acc.ton}`
                            );
                        }
                        acc.addPsalm(psalmus);
                        return acc;
                    },
                    new Psalterium(ton.length > 0 && ton != "0" ? ton : null));
            },
            saveTranslation(psalterium: Psalterium, trad) {
                if (trad.trim() === "{}") {
                    psalterium.translation = true;
                    return;
                }
                trad.split(";;").map(function (title: string, index: number) {
                    title = title.trim();
                    if (title.length > 0) {
                        psalterium.translation = true;
                        const psalm = psalterium.psalms[index];
                        psalm.translation = true;
                        if (psalm.title === false) {
                            const newTitle = new PsalmTitle(new TextNode());
                            psalm.title = newTitle;
                            newTitle.content.context = psalm.title;
                        }
                        if (psalm.title) {
                            psalm.title.translation = true;
                            psalm.title.content.fr = title;
                        }
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
                        return new GenericElement();
                }
            },
        },
    ],
    defaultCase: function (paragraph: string) {
        const p = new ParagraphStd(new TextNode(paragraph));
        p.text.context = p;
        return p;
    },
});

export default blockConfig;
