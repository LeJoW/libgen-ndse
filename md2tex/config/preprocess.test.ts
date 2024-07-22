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
});
