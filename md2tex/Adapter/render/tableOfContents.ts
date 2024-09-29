import { Render } from "../../Render/Render.i";
import { TableOfContents } from "../../Types/TableOfContents";
import { Adapter } from "../Adapter.i";

export const renderTableOfContents = (adapter: Adapter) =>
    function ({ contents }: TableOfContents): string {
        return printTableOfContents(
            adapter.engine,
            contents,
            adapter.translation
        );
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
                                      translate && day.shortTitle.fr
                                          ? day.shortTitle.fr
                                          : day.shortTitle.la,
                              })
                            : undefined,
                        entries.length > 0
                            ? engine.container(
                                  "sectionEntries",
                                  engine.join(
                                      entries.map(({ office, anchor }) =>
                                          engine.orphan("sectionEntry", {
                                              office:
                                                  translate &&
                                                  office.shortTitle.fr
                                                      ? office.shortTitle.fr
                                                      : office.shortTitle.la,
                                              anchor,
                                          })
                                      )
                                  )
                              )
                            : undefined,
                    ])
                )
            )
        )
    );
}
