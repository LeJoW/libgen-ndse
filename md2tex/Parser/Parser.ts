import { Document } from "../Document/Document.i";
import { Adapter } from "../Adapter/Adapter.i";
import { Rules } from "../Rules/Rules.i";
import { GenericElement } from "../Types/GenericElement.i";
import { TextNode } from "../Types/TextNode.i";

export default class Parser {
    private rules: Rules;
    private adapter: Adapter;

    constructor(rules: Rules, adapter: Adapter) {
        this.rules = rules;
        this.adapter = adapter;
    }

    parseBlocks(doc: Document) {
        return this.rules.preprocess(doc).map((rawBlock: string) => {
            const { block, translation } = this.rules.getTranslation(rawBlock);
            const {
                mask,
                replace,
                storeTranslation,
            } = this.rules.getBlockConverter(block);
            return {
                block,
                mask,
                replace,
                parseTranslation:
                    storeTranslation && translation
                        ? (element: GenericElement) => {
                              element.translation = true;
                              return storeTranslation(
                                  element,
                                  translation,
                                  mask
                              );
                          }
                        : undefined,
            };
        });
    }

    parseString(input: string): string {
        return this.rules
            .getStringConverters()
            .reduce(function (acc: string, { mask, replace }): string {
                return acc.replace(mask, replace);
            }, input);
    }

    parseElementTextNodes(element: GenericElement): GenericElement {
        element.TextNodes.map((node: TextNode) => {
            node.la = this.parseString(node.la);
            if (node.fr) {
                node.fr = this.parseString(node.fr);
            }
        });
        return element;
    }

    parse(doc: Document): string {
        try {
            return this.parseBlocks(doc)
                .map(({ block, mask, replace, parseTranslation }) =>
                    block.replace(mask, (...params) => {
                        const element = replace(...params);
                        if (parseTranslation) parseTranslation(element);
                        return this.adapter.render(
                            this.parseElementTextNodes(element)
                        );
                    })
                )
                .join("\n\n");
        } catch (error) {
            console.log(error);
            return "";
        }
    }
}
