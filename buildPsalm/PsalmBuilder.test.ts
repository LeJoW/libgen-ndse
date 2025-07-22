import { PsalmBuilder } from "./PsalmBuilder";
import { Syllabifier } from "./Syllabifier";

const syllabifier = new Syllabifier("tex2pdf/hyphen/hyph_la_VA_all.dic");

const ps = new PsalmBuilder(syllabifier);

ps.styles.bold = (text: string) => `[${text}]`;
ps.styles.italic = (text: string) => `(${text})`;
ps.symbols.star = " *";
ps.symbols.cross = " +";
ps.symbols.discretionary = "-";

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

test("Verse hyphenation", function () {
    expect(ps.hyphenate("et exquíram eam semper.", 2, 3)).toStrictEqual([
        "et ",
        "ex-",
        "quí-",
        "ram ",
        "e",
        "am ",
        "sem-",
        "per.",
    ]);

    expect(
        ps.hyphenate(
            "Legem pone mihi, Dómine, viam iustificatiónum tuárum:",
            2,
            3
        )
    ).toStrictEqual([
        "Le-",
        "gem ",
        "po",
        "ne ",
        "mi",
        "hi, ",
        "Dó-",
        "mi",
        "ne, ",
        "vi",
        "am ",
        "ius-",
        "ti-",
        "fi-",
        "ca-",
        "ti-",
        "ó-",
        "num ",
        "tu-",
        "á-",
        "rum:",
    ]);

    expect(
        ps.hyphenate("Sicut erat in princípio, et nunc, et semper,", 2, 3)
    ).toStrictEqual([
        "Sic",
        "ut ",
        "e",
        "rat ",
        "in ",
        "prin-",
        "cí-",
        "pi",
        "o, ",
        "et ",
        "nunc, ",
        "et ",
        "sem-",
        "per,",
    ]);
});

test("half-verse setup", function () {
    expect(ps.setUpHalfVerse("et exquíram eam semper.", [0, 1])).toStrictEqual(
        "et ex-quí-ram eam [sém-]per."
    );

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [0, 2])).toStrictEqual(
        "et ex-quí-ram [é]am [sém-]per."
    );

    expect(ps.setUpHalfVerse("semper.", [0, 2])).toStrictEqual("[sém-]per.");

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [1, 2])).toStrictEqual(
        "et ex-quí-(ram) [é]am [sém-]per."
    );

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [2, 2])).toStrictEqual(
        "et ex-(quí-ram) [é]am [sém-]per."
    );

    expect(ps.setUpHalfVerse("semper.", [2, 2])).toStrictEqual("[sém-]per.");

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [4, 2])).toStrictEqual(
        "(et) (ex-quí-ram) [é]am [sém-]per."
    );

    expect(ps.setUpHalfVerse("et exquíram eam semper.", [0, 0])).toStrictEqual(
        "et ex-quí-ram eam sem-per."
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
        "Le-gem pone mihi, Dó-mine, viam ius-ti-fi-ca-ti-[ó-]num tu-[á-]rum: * et ex-quí-ram (eam) [sém-]per."
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
        "Illústra fáciem tuam super servum tuum, + sal-vum me fac in mi-se-ri-[cór-]dia [tú]a: * Dó-mine, non con-fún-dar, quón-iam (in-vo-)[cá]vi te."
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
        "Le-gem pone mihi, Dó-mine, viam ius-ti-fi-ca-ti-[ó-]num tu-[á-]rum: * et ex-quí-ram (eam) [sém-]per.",
        "Da mihi in-tel-léc-tum, et scru-tá-bor [lé-]gem [tú]am: * et cu-stó-diam il-lam in toto (corde) [mé]o.",
        "Gló-ria [Pá-]tri, et [Fí-]lio, * et Spi-rí-(tui) [Sánc]to.",
        "Sicut erat in prin-cí-pio, et [núnc], et [sém-]per, * et in sǽ-cula sæ-cu-(ló-rum). [A]men.",
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
        "Le-gem pone mihi, Dó-mine, viam ius-ti-fi-ca-ti-[ó-]num tu-[á-]rum: * et ex-quí-ram [é]am [sém-]per.",
        "Da mihi in-tel-léc-tum, et scru-tá-bor [lé-]gem [tú]am: * et cu-stó-diam il-lam in toto [cór]de [mé]o.",
        "Gló-ria [Pá-]tri, et [Fí-li]o, * et Spi-[rí-]tui [Sánc]to.",
        "Sicut erat in prin-cí-pio, et [núnc], et [sém-]per, * et in sǽ-cula sæ-cu-[ló-]rum. [A]men.",
    ]);
});
