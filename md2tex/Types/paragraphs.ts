import { GenericElement } from "./GenericElement";
import { TextNode } from "./TextNode.i";

export class ParagraphStd extends GenericElement {
    text: TextNode;

    constructor(text: TextNode) {
        super();
        this.text = text;
    }
}

export class ParagraphLettrine extends ParagraphStd {}

export class Rubric extends ParagraphStd {}

export class RemplacementRubric extends ParagraphStd {}

export class Lesson extends ParagraphStd {}
