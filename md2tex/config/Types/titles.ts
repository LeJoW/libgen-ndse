import { TableOfContents } from "../../Types/TableOfContents";
import { TextNode } from "../../Types/TextNode";
import {
    DayTitle,
    LessonTitle,
    OfficeTitle,
    PsalmTitle,
    SectionTitle,
    Title,
} from "../../Types/titles";

export const titlesConfig = (table: TableOfContents) => ({
    test: /^(#+)\s+([\S\s]+?)\s*(?:<([\S\s]+?)>)?\s*(?:\{([\S\s]+?)\})?\s*$/i,
    callback: function titre(
        _,
        titleLevel,
        title,
        summary = "",
        subTitle = ""
    ): Title {
        const titleNode = new TextNode(title);
        const summaryNode = new TextNode(summary.length > 0 ? summary : title);
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
                const officeTitle = new OfficeTitle(titleNode, summaryNode);
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
        const [, , title, summary, subTitle] = trad.match(mask) as string[];
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
});
