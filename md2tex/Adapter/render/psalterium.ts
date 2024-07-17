import { Cantus } from "../../Types/Cantus";
import { ParagraphLettrine } from "../../Types/paragraphs";
import { Psalmus } from "../../Types/Psalterium";
import { Adapter } from "../Adapter.i";
import { renderPsalmTitle } from "./titles";

export const renderPsalterium = (adapter: Adapter) =>
    function (intonation: Cantus | false, psalms: Psalmus[]): string {
        const beforePsalmBody: string[] = [];
        let psalmBody;
        if (intonation && psalms.length > 0) {
            const firstPsalm = psalms[0];
            beforePsalmBody.push(
                adapter.engine.concat([
                    firstPsalm.title
                        ? renderPsalmTitle(adapter.engine)(firstPsalm.title)
                        : undefined,
                    firstPsalm.anchor
                        ? adapter.engine.orphan("anchor", {
                              href: firstPsalm.anchor,
                          })
                        : undefined,
                ]),
                adapter.render(intonation)
            );
            psalmBody = [
                adapter.engine.container(
                    "psalm",
                    adapter.engine.join(firstPsalm.versi.slice(1))
                ),
                ...psalms.slice(1).map((psalm) => adapter.render(psalm)),
            ];
        } else {
            psalmBody = psalms.map((psalm) => adapter.render(psalm));
        }

        return adapter.engine.container(
            "psalterium",
            adapter.engine.join([
                ...beforePsalmBody,
                adapter.engine.container(
                    "psalmBody",
                    adapter.engine.join(psalmBody)
                ),
            ])
        );
    };

export const renderPsalteriumTRAD = (adapter: Adapter) =>
    function (intonation: Cantus | false, psalms: Psalmus[]): string {
        return adapter.engine.join(
            psalms.map(function (psalm) {
                if (!psalm.translation) {
                    return renderPsalmus(adapter)(psalm);
                }
                return adapter.engine.join([
                    psalm.title
                        ? renderPsalmTitle(adapter.engine)(psalm.title)
                        : undefined,
                    adapter.engine.container(
                        "psalmTrad",
                        adapter.engine.join(
                            psalm.versi.map(function (verse, index) {
                                return adapter.engine.concat([
                                    adapter.engine.orphan("psalmLA", {
                                        value: verse,
                                    }),
                                    adapter.engine.orphan("psalmFR", {
                                        value:
                                            psalm.translation![index] ??
                                            undefined,
                                    }),
                                    adapter.engine.orphan("psalmVerseEnd"),
                                ]);
                            })
                        )
                    ),
                ]);
            })
        );
    };

export const renderPsalmus = (adapter: Adapter) =>
    function (psalm: Psalmus): string {
        return adapter.engine.join([
            adapter.engine.concat([
                psalm.title
                    ? renderPsalmTitle(adapter.engine)(psalm.title)
                    : undefined,
                psalm.anchor
                    ? adapter.engine.orphan("anchor", { href: psalm.anchor })
                    : undefined,
            ]),
            adapter.render(new ParagraphLettrine(psalm.versi[0])),
            adapter.engine.container(
                "psalm",
                adapter.engine.join(psalm.versi.slice(1))
            ),
        ]);
    };
