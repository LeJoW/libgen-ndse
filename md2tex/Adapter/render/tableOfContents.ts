import { Render } from "../../Render/Render.i";
import { TableOfContents } from "../../Types/TableOfContents";
import { Adapter } from "../Adapter.i";

export const renderTableOfContents = ({ engine }: Adapter) =>
    function ({ contents }: TableOfContents): string {
        return printTableOfContents(engine, contents, false);
    };

export const renderTableOfContentsTRAD = ({ engine }: Adapter) =>
    function ({ contents }: TableOfContents): string {
        return printTableOfContents(engine, contents, true);
    };

function printTableOfContents(
    engine: Render,
    contents: TableOfContents["contents"],
    translate: boolean
) {
    return engine.container(
        "tableOfContents",
        engine.join(
            contents.map(({ day, entries }) =>
                engine.container(
                    "tableSection",
                    engine.join([
                        day !== null
                            ? engine.orphan("tableSectionTitle", {
                                  day:
                                      translate && day.translation
                                          ? day.translation.shortTitle
                                          : day.shortTitle,
                              })
                            : undefined,
                        engine.container(
                            "sectionEntries",
                            engine.join(
                                entries.map(({ office, anchor }) =>
                                    engine.orphan("sectionEntry", {
                                        office:
                                            translate && office.translation
                                                ? office.translation.shortTitle
                                                : office.shortTitle,
                                        anchor,
                                    })
                                )
                            )
                        ),
                    ])
                )
            )
        )
    );
}
