import { TypeConfig } from "../../Rules/Rules.i";
import { Cantus, Antiphona, Hymnus, Responsorium } from "../../Types/Cantus";
import { GregoIndex } from "../../Types/GregoIndex";
import { TextNode } from "../../Types/TextNode";

export const cantusConfig = (gregoIndex: GregoIndex): TypeConfig => ({
    test: /^!\[(.*)\]\(([\S]+)\)$/,
    callback(_, label, file): Cantus {
        const matches = label.match(/(?:([1-8pi]+):)?(\w+):(.+)/);
        let cantus = new Cantus(file);

        if (matches !== null) {
            const [, ton, type, title] = matches as string[];

            switch (type) {
                case "ant":
                    cantus = new Antiphona(file);
                    gregoIndex.addAntiphona(cantus);
                    break;
                case "hymn":
                    cantus = new Hymnus(file);
                    gregoIndex.addHymnus(cantus);
                    break;
                case "resp":
                    cantus = new Responsorium(file);
                    gregoIndex.addResponsorium(cantus);
                    break;
            }
            cantus.ton = ton;
            cantus.mode = parseInt(ton);
            cantus.incipit = title;
        }

        return cantus;
    },
    saveTranslation: function (cantus: Cantus, trad) {
        cantus.text = new TextNode();
        cantus.text.fr = trad;
        cantus.text.context = cantus;
    },
});
