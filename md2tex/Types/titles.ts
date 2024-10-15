import { GenericElement } from "./GenericElement";
import { TextNode } from "./TextNode.i";

export class Title extends GenericElement {
    content: TextNode;

    constructor(title: TextNode) {
        super();
        this.content = title;
    }
}

export class DayTitle extends Title {
    shortTitle: TextNode;
    dayClass: TextNode | null = null;

    constructor(title: TextNode, shortTitle: TextNode) {
        super(title);
        this.shortTitle = shortTitle;
    }
}

export class OfficeTitle extends Title {
    shortTitle: TextNode;
    anchor: string | null = null;

    constructor(title: TextNode, shortTitle: TextNode) {
        super(title);
        this.shortTitle = shortTitle;
    }
}

export class LessonTitle extends Title {
    addendum: TextNode | null = null;

    constructor(title: TextNode) {
        super(title);
        this.content = title;
    }
}

export class PsalmTitle extends Title {}

export class SectionTitle extends Title {}
