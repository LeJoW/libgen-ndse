import { test, expect } from "@jest/globals";
import { Syllabifier, Helpers } from "./Syllabifier";
import { Help } from "commander";

const syllabifier = new Syllabifier("tex2pdf/hyphen/hyph_la_VA_all.dic");

test("Helpers", function () {
    expect(
        Helpers.removeAccutes(
            "In éxitu Israël de Ægýpto, * domus Iacob de pópulo bárbaro"
        )
    ).toStrictEqual(
        "In exitu Israel de Ægypto, * domus Iacob de populo barbaro"
    );
    expect(
        Helpers.removeAccutes(
            "Facta est Iudǽa sanctificátio éius, * Israël potéstas éius."
        )
    ).toStrictEqual(
        "Facta est Iudæa sanctificatio eius, * Israel potestas eius."
    );
    expect(
        Helpers.lowerCase(
            "In exitu Israel de Ægypto, * domus Iacob de populo barbaro"
        )
    ).toStrictEqual(
        "in exitu israel de ægypto, * domus iacob de populo barbaro"
    );

    expect(
        Helpers.mergeWithPriority(
            ["A", "r", "b", "r", "e"],
            ["a", "r", "-", "b", "r", "e"],
            function (y) {
                return y != "-";
            }
        )
    ).toStrictEqual(["A", "r", "-", "b", "r", "e"]);
    expect(
        Helpers.mergeWithPriority(
            [
                "in",
                "ex=i=tu",
                "is=ra=el",
                "de",
                "æ=gyp=to",
                "do=mus",
                "ia=cob",
                "de",
                "po=pu=lo",
                "bar=ba=ro",
            ],
            [
                "in",
                "exitu",
                "israel",
                "de",
                "ægypto",
                ", *",
                "domus",
                "iacob",
                "de",
                "populo",
                "barbaro",
                ".",
            ],
            function (y) {
                return /[\w]/.test(y);
            }
        )
    ).toStrictEqual([
        "in",
        "ex=i=tu",
        "is=ra=el",
        "de",
        "æ=gyp=to",
        ", *",
        "do=mus",
        "ia=cob",
        "de",
        "po=pu=lo",
        "bar=ba=ro",
        ".",
    ]);

    expect(Helpers.str2array("My string")).toStrictEqual([
        "M",
        "y",
        " ",
        "s",
        "t",
        "r",
        "i",
        "n",
        "g",
    ]);
    expect(Helpers.str2array("In éxitu Israël de Ægýpto")).toStrictEqual([
        "I",
        "n",
        " ",
        "é",
        "x",
        "i",
        "t",
        "u",
        " ",
        "I",
        "s",
        "r",
        "a",
        "ë",
        "l",
        " ",
        "d",
        "e",
        " ",
        "Æ",
        "g",
        "ý",
        "p",
        "t",
        "o",
    ]);
});

test("Syllabification Preparation", function () {
    expect(
        syllabifier.prepare(
            "In éxitu Israël de Ægýpto, * domus Iacob de pópulo bárbaro."
        )
    ).toStrictEqual([
        "in",
        "exitu",
        "israel",
        "de",
        "ægypto",
        ", *",
        "domus",
        "iacob",
        "de",
        "populo",
        "barbaro",
        ".",
    ]);
    expect(
        syllabifier.hyphenateArray([
            "in",
            "exitu",
            "israel",
            "de",
            "ægypto",
            ", *",
            "domus",
            "iacob",
            "de",
            "populo",
            "barbaro",
            ".",
        ])
    ).toStrictEqual([
        "in",
        "ex=i=tu",
        "i=sra=el",
        "de",
        "æ=gyp=to",
        "do=mus",
        "ia=cob",
        "de",
        "po=pu=lo",
        "bar=ba=ro",
    ]);
});

test("raw hyphenation", function () {
    expect(syllabifier.rawHyphenate("semper")).toStrictEqual("sem=per");
    expect(syllabifier.rawHyphenate("eam semper")).toStrictEqual(
        "e=am =sem=per"
    );
    expect(
        syllabifier.rawHyphenate(
            "In éxitu Israël de Ægýpto, * domus Iacob de pópulo bárbaro."
        )
    ).toStrictEqual(
        "In =éx=i=tu =I=sra=ël =de =Æ=gýp=to, * =do=mus =Ia=cob =de =pó=pu=lo =bár=ba=ro."
    );
});

test("getSyllabsOf", function () {
    expect(syllabifier.getSyllabsOf("semper")).toStrictEqual(["sem", "per"]);
    expect(syllabifier.getSyllabsOf("eam semper")).toStrictEqual([
        "e",
        "am ",
        "sem",
        "per",
    ]);
    expect(syllabifier.getSyllabsOf("ipsam vólui")).toStrictEqual([
        "i",
        "psam ",
        "vó",
        "lu",
        "i",
    ]);

    expect(syllabifier.getSyllabsOf("semper.")).toStrictEqual(["sem", "per."]);
    expect(syllabifier.getSyllabsOf("semper:")).toStrictEqual(["sem", "per:"]);
    expect(syllabifier.getSyllabsOf("Semper:")).toStrictEqual(["Sem", "per:"]);
    expect(
        syllabifier.getSyllabsOf(
            "Legem pone mihi, Dómine, viam iustificatiónum tuárum:"
        )
    ).toStrictEqual([
        "Le",
        "gem ",
        "po",
        "ne ",
        "mi",
        "hi, ",
        "Dó",
        "mi",
        "ne, ",
        "vi",
        "am ",
        "ius",
        "ti",
        "fi",
        "ca",
        "ti",
        "ó",
        "num ",
        "tu",
        "á",
        "rum:",
    ]);

    expect(syllabifier.getSyllabsOf("semper _")).toStrictEqual([
        "sem",
        "per ",
        "_",
    ]);
    expect(syllabifier.getSyllabsOf("semper ---")).toStrictEqual([
        "sem",
        "per --",
    ]);

    expect(syllabifier.getSyllabsOf("omnes abýssi")).toStrictEqual([
        "om",
        "nes ",
        "ab",
        "ýs",
        "si",
    ]);

    expect(syllabifier.getSyllabsOf("Israël de Ægýpto")).toStrictEqual([
        "I",
        "sra",
        "ël ",
        "de ",
        "Æ",
        "gýp",
        "to",
    ]);
});
