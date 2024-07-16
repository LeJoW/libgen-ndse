import { PsalmBuilder } from "../../buildPsalm/PsalmBuilder";
import { Antiphona, Hymnus } from "./Cantus";
import { GregoIndex } from "./GregoIndex";
import { Canticum, Psalmus } from "./Psalterium";

const psB = {
    buildPsalm: function (psalmDivision: string, ton: string): string[] {
        return [];
    },
} as PsalmBuilder;

test("", function () {
    const index = new GregoIndex();

    const ps1 = new Psalmus("1f", "118a", psB);
    index.addPsalmus(ps1);
    const ps2 = new Psalmus("1f", "53", psB);
    index.addPsalmus(ps2);
    expect(index.getPsalmos()).toStrictEqual({ "53": [ps2], "118a": [ps1] });

    const cant1 = new Canticum("1f", "zach", psB);
    index.addCanticum(cant1);
    expect(index.getCanticos()).toStrictEqual({ zach: [cant1] });

    const antPueri = new Antiphona("");
    antPueri.incipit = "Pueri";
    index.addAntiphona(antPueri);

    const antABimatu = new Antiphona("");
    antABimatu.incipit = "A bimatu";
    index.addAntiphona(antABimatu);

    const antAEterne = new Antiphona("");
    antAEterne.incipit = "Æterne";
    index.addAntiphona(antAEterne);

    const antASolis = new Antiphona("");
    antASolis.incipit = "A solis ortu";
    index.addAntiphona(antASolis);

    const hymn = new Hymnus("");
    index.addHymnus(hymn);
    hymn.incipit = "Lucis creator";

    expect(index.getCantos()).toStrictEqual({
        antiphonae: [[antABimatu, antAEterne, antASolis], [antPueri]],
        hymni: [[hymn]],
        responsoria: [],
    });
});
