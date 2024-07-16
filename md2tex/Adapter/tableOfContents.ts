import { Render } from "../Render/Render.i";
import { TableOfContents } from "../Types/TableOfContents";

export const renderTableOfContents = (engine: Render) =>
    function (contents: TableOfContents["contents"]): string {
        return engine.container(
            "tableOfContents",
            engine.join(
                contents.map(({ day, entries }) =>
                    engine.container(
                        "tableSection",
                        engine.join([
                            day !== null
                                ? engine.orphan("tableSectionTitle", {
                                      day: day.shortTitle,
                                  })
                                : undefined,
                            engine.container(
                                "sectionEntries",
                                engine.join(
                                    entries.map(({ office, anchor }) =>
                                        engine.orphan("sectionEntry", {
                                            office: office.shortTitle,
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
    };
