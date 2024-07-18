import { TableOfContents } from "../../Types/TableOfContents";
import { Adapter } from "../Adapter.i";

export const renderTableOfContents = ({ engine }: Adapter) =>
    function ({ contents }: TableOfContents): string {
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
