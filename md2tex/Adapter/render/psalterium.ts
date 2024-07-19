import { ParagraphLettrine } from "../../Types/paragraphs";
import { Psalmus, Psalterium } from "../../Types/Psalterium";
import { Adapter } from "../Adapter.i";

export const renderPsalterium = (adapter: Adapter) =>
    function ({ intonation, psalms }: Psalterium): string {
        const beforePsalmBody: string[] = [];
        let psalmBody;
        if (intonation && psalms.length > 0) {
            const firstPsalm = psalms[0];
            beforePsalmBody.push(
                adapter.engine.concat([
                    firstPsalm.title
                        ? adapter.render(firstPsalm.title)
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
    function ({ psalms }: Psalterium): string {
        return adapter.engine.join(
            psalms.map(function (psalm) {
                if (!psalm.translation) {
                    return renderPsalmus(adapter)(psalm);
                }
                return adapter.engine.join([
                    psalm.title ? adapter.render(psalm.title) : undefined,
                    psalm.anchor
                        ? adapter.engine.orphan("anchor", {
                              href: psalm.anchor,
                          })
                        : undefined,
                    adapter.engine.container(
                        "psalmTrad",
                        adapter.engine.join(
                            psalm.versi
                                .slice(0, -2)
                                .map(function (verse, index) {
                                    return adapter.engine.concat([
                                        adapter.engine.orphan("psalmFR", {
                                            value:
                                                psalm.translation![index] ??
                                                undefined,
                                        }),
                                        adapter.engine.orphan("psalmLA", {
                                            value:
                                                index === 0
                                                    ? adapter.render(
                                                          new ParagraphLettrine(
                                                              verse
                                                          )
                                                      )
                                                    : verse,
                                        }),
                                    ]);
                                })
                        )
                    ),
                    ...(psalm.doxologie ? psalm.versi.slice(-2) : []).map(
                        function (verse): string {
                            return verse;
                        }
                    ),
                ]);
            })
        );
    };

export const renderPsalmus = (adapter: Adapter) =>
    function ({ title, anchor, versi }: Psalmus): string {
        return adapter.engine.join([
            adapter.engine.concat([
                title ? adapter.render(title) : undefined,
                anchor
                    ? adapter.engine.orphan("anchor", { href: anchor })
                    : undefined,
            ]),
            adapter.render(new ParagraphLettrine(versi[0])),
            adapter.engine.container(
                "psalm",
                adapter.engine.join(versi.slice(1))
            ),
        ]);
    };
