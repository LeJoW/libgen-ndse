import { ParagraphLettrine } from "../../Types/paragraphs";
import { Psalmus, Psalterium } from "../../Types/Psalterium";
import { Adapter } from "../Adapter.i";

export const renderPsalterium = (adapter: Adapter) =>
    function ({ psalms }: Psalterium): string {
        const beforePsalmBody: string[] = [];
        let psalmBody;
        if (psalms.length > 0 && psalms[0].intonation) {
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
                adapter.render(psalms[0].intonation)
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
        return adapter.engine.container(
            "psalterium",
            adapter.engine.join(
                psalms.map(function (psalm, index) {
                    return adapter.render(psalm);
                })
            )
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

export const renderPsalmusTRAD = (adapter: Adapter) =>
    function ({
        intonation,
        anchor,
        versi,
        doxologie,
        translation,
        title,
    }: Omit<Psalmus, "translation"> & {
        translation: Exclude<Psalmus["translation"], false>;
    }): string {
        if (intonation) {
            intonation.setTranslation(translation[0]);
        }
        return adapter.engine.join([
            title ? adapter.render(title) : undefined,
            anchor
                ? adapter.engine.orphan("anchor", {
                      href: anchor,
                  })
                : undefined,
            intonation ? adapter.render(intonation) : undefined,
            adapter.engine.container(
                "psalmTrad",
                adapter.engine.join(
                    versi
                        .slice(intonation ? 1 : 0, -2)
                        .map(function (verse, index) {
                            return adapter.engine.concat([
                                adapter.engine.orphan("psalmFR", {
                                    value:
                                        translation[
                                            index + (intonation ? 1 : 0)
                                        ] ?? "",
                                }),
                                adapter.engine.orphan("psalmLA", {
                                    value:
                                        index === 0 && !intonation
                                            ? adapter.render(
                                                  new ParagraphLettrine(verse)
                                              )
                                            : verse,
                                }),
                            ]);
                        })
                )
            ),
            ...(doxologie ? versi.slice(-2) : []).map(function (verse): string {
                return adapter.engine.orphan("aloneDoxologie", {
                    content: verse,
                });
            }),
        ]);
    };
