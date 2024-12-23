import { PsalmBuilder } from "./PsalmBuilder";
import { Syllabifier } from "./Syllabifier";

const syllabifier = new Syllabifier("tex2pdf/hyphen/hyph_la_VA_all.dic");

const ps = new PsalmBuilder(syllabifier);

ps.styles.bold = (text: string) => `[${text}]`;
ps.styles.italic = (text: string) => `(${text})`;
ps.symbols.star = " *";

test("Accent detection", function () {
    expect(ps.getLastAccent(["sem", "per"])).toStrictEqual({
        before: [],
        accent: "sem",
        after: ["per"],
    });

    expect(ps.getLastAccent(["e", "am ", "sem", "per"])).toStrictEqual({
        before: ["e", "am "],
        accent: "sem",
        after: ["per"],
    });

    expect(ps.getLastAccent(["i", "psam ", "vó", "lu", "i"])).toStrictEqual({
        before: ["i", "psam "],
        accent: "vó",
        after: ["lu", "i"],
    });

    expect(ps.getLastAccent(["vi", "ví", "fi", "ca ", "me"])).toStrictEqual({
        before: ["vi", "ví", "fi"],
        accent: "ca ",
        after: ["me"],
    });

    expect(ps.getLastAccent(["con", "so", "lá", "tus ", "sum"])).toStrictEqual({
        before: ["con", "so"],
        accent: "lá",
        after: ["tus ", "sum"],
    });

    expect(ps.getLastAccent(["su", "per ", "me"])).toStrictEqual({
        before: [],
        accent: "su",
        after: ["per ", "me"],
    });

    expect(
        ps.getLastAccent(["vé", "ni", "at ", "su", "per ", "me"])
    ).toStrictEqual({
        before: ["vé", "ni", "at "],
        accent: "su",
        after: ["per ", "me"],
    });

    expect(ps.getLastAccent(["et ", "nunc ", "et"])).toStrictEqual({
        before: ["et "],
        accent: "nunc ",
        after: ["et"],
    });

    expect(ps.getLastAccent(["A", "a", "ron"])).toStrictEqual({
        before: [],
        accent: "A",
        after: ["a", "ron"],
    });

    expect(ps.getLastAccent(["dó", "mu", "i ", "A", "a", "ron"])).toStrictEqual(
        {
            before: ["dó", "mu", "i "],
            accent: "A",
            after: ["a", "ron"],
        }
    );
});

test("Accentuate", function () {
    expect(ps.accentuate("af")).toStrictEqual("áf");
    expect(ps.accentuate("Af")).toStrictEqual("Af");
    expect(ps.accentuate("sem")).toStrictEqual("sém");
    expect(ps.accentuate("im")).toStrictEqual("ím");
    expect(ps.accentuate("o")).toStrictEqual("ó");
    expect(ps.accentuate("yl")).toStrictEqual("ýl");
    expect(ps.accentuate("ær")).toStrictEqual("ǽr");
    expect(ps.accentuate("auf")).toStrictEqual("áuf");
    expect(ps.accentuate("Fíli")).toStrictEqual("Fíli");
});

test("Check latin accent", function () {
    expect(
        ps.isSpirit({ before: ["Ma"], accent: "gní", after: ["fi", "cat"] })
    ).toStrictEqual(true);

    expect(
        ps.isSpirit({
            before: ["spi", "ri", "tus "],
            accent: "me",
            after: ["us "],
        })
    ).toStrictEqual(true);

    expect(
        ps.isSpirit({
            before: ["sté", "ri"],
            accent: "lem ",
            after: ["in"],
        })
    ).toStrictEqual(false);

    expect(
        ps.isSpirit({
            before: ["et "],
            accent: "nunc, ",
            after: ["et "],
        })
    ).toStrictEqual(true);

    expect(
        ps.isSpirit({
            before: ["et "],
            accent: "æ",
            after: ["qui"],
        })
    ).toStrictEqual(false);

    expect(
        ps.isSpirit({
            before: ["mi", "ni "],
            accent: "be",
            after: ["ne"],
        })
    ).toStrictEqual(false);
});

test("half-verse setup", function () {
    expect(ps.setUpHalfVerse("et exquíram eam semper.", [0, 1])).toStrictEqual(
        "et exquíram eam [sém]per."
    );

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [0, 2])).toStrictEqual(
        "et exquíram [é]am [sém]per."
    );

    expect(ps.setUpHalfVerse("semper.", [0, 2])).toStrictEqual("[sém]per.");

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [1, 2])).toStrictEqual(
        "et exquí(ram) [é]am [sém]per."
    );

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [2, 2])).toStrictEqual(
        "et ex(quíram) [é]am [sém]per."
    );

    expect(ps.setUpHalfVerse("semper.", [2, 2])).toStrictEqual("[sém]per.");

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [4, 2])).toStrictEqual(
        "(et) (exquíram) [é]am [sém]per."
    );

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [0, 0])).toStrictEqual(
        "et exquíram eam semper."
    );
});

test("verse setup", function () {
    expect(
        ps.setUpVerse(
            [
                "Legem pone mihi, Dómine, viam iustificatiónum tuárum:",
                "et exquíram eam semper.",
            ],
            { mediante: [0, 2], end: [2, 1] }
        )
    ).toStrictEqual(
        "Legem pone mihi, Dómine, viam iustificati[ó]num tu[á]rum: * et exquíram (eam) [sém]per."
    );

    expect(
        ps.setUpVerse(
            [
                "Illústra fáciem tuam super servum tuum,",
                "salvum me fac in misericórdia tua:",
                "Dómine, non confúndar, quóniam invocávi te.",
            ],
            { mediante: [0, 2], end: [2, 1] }
        )
    ).toStrictEqual(
        "Illústra fáciem tuam super servum tuum, + salvum me fac in miseri[cór]dia [tú]a: * Dómine, non confúndar, quóniam (invo)[cá]vi te."
    );
});

test("all", function () {
    expect(
        ps.buildPsalm(
            [
                [
                    "Legem pone mihi, Dómine, viam iustificatiónum tuárum:",
                    "et exquíram eam semper.",
                ],
                [
                    "Da mihi intelléctum, et scrutábor legem tuam:",
                    "et custódiam illam in toto corde meo.",
                ],
                ["Glória Patri, et Fílio,", "et Spirítui Sancto."],
                [
                    "Sicut erat in princípio, et nunc, et semper,",
                    "et in sǽcula sæculórum. Amen.",
                ],
            ],
            "1f"
        )
    ).toStrictEqual([
        "Legem pone mihi, Dómine, viam iustificati[ó]num tu[á]rum: * et exquíram (eam) [sém]per.",
        "Da mihi intelléctum, et scrutábor [lé]gem [tú]am: * et custódiam illam in toto (corde) [mé]o.",
        "Glória [Pá]tri, et [Fí]lio, * et Spirí(tui) [Sánc]to.",
        "Sicut erat in princípio, et [núnc], et [sém]per, * et in sǽcula sæcu(lórum). [A]men.",
    ]);
    expect(
        ps.buildPsalm(
            [
                [
                    "Legem pone mihi, Dómine, viam iustificatiónum tuárum:",
                    "et exquíram eam semper.",
                ],
                [
                    "Da mihi intelléctum, et scrutábor legem tuam:",
                    "et custódiam illam in toto corde meo.",
                ],
                ["Glória Patri, et Fílio,", "et Spirítui Sancto."],
                [
                    "Sicut erat in princípio, et nunc, et semper,",
                    "et in sǽcula sæculórum. Amen.",
                ],
            ],
            "3b"
        )
    ).toStrictEqual([
        "Legem pone mihi, Dómine, viam iustificati[ó]num tu[á]rum: * et exquíram [é]am [sém]per.",
        "Da mihi intelléctum, et scrutábor [lé]gem [tú]am: * et custódiam illam in toto [cór]de [mé]o.",
        "Glória [Pá]tri, et [Fíli]o, * et Spi[rí]tui [Sánc]to.",
        "Sicut erat in princípio, et [núnc], et [sém]per, * et in sǽcula sæcu[ló]rum. [A]men.",
    ]);
});
