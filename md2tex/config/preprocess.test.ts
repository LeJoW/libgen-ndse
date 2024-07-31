import { preprocess } from "./preprocess";

test("", function () {
    expect(preprocess("")).toStrictEqual([""]);

    expect(preprocess("Test")).toStrictEqual(["Test"]);

    expect(preprocess("Test\n\net retest")).toStrictEqual([
        "Test",
        "et retest",
    ]);

    expect(preprocess("Test\n\n$et retest$")).toStrictEqual([
        "Test $et retest$",
    ]);

    expect(preprocess("Test\n\n$\net retest\n$")).toStrictEqual([
        "Test $et retest$",
    ]);

    expect(preprocess("> aze\n> eza")).toStrictEqual(["> aze eza"]);
    expect(preprocess("> aze\n> eza --- \n> test")).toStrictEqual([
        "> aze eza --- test",
    ]);

    expect(preprocess("nothing \\$ to say")).toStrictEqual([
        "nothing $ to say",
    ]);

    expect(preprocess("%nothing")).toStrictEqual([""]);

    expect(preprocess("%\n")).toStrictEqual([""]);

    expect(preprocess("aze %\n")).toStrictEqual(["aze "]);
    expect(preprocess("aze %\n eaz")).toStrictEqual(["aze eaz"]);
    expect(preprocess("aze % comment\n%other comment\n eaz")).toStrictEqual(["aze eaz"]);
});
