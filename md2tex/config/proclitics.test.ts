import { removeProcliticsAccents, testFunctions } from "./proclitics";
const { trimWord, isProclitic } = testFunctions;

test("trim Word", function () {
    expect(trimWord("ét")).toBe("ét");
    expect(trimWord("*ét*")).toBe("ét");
});

test("proclitic Detection", function () {
    expect(isProclitic("ét")).toBe(true);
});

test("Proclitics", function () {
    expect(removeProcliticsAccents("ét")).toBe("et");
    expect(removeProcliticsAccents("métipsi")).toBe("métipsi");
    expect(removeProcliticsAccents("*ét*")).toBe("*et*");
    expect(removeProcliticsAccents("_ét_")).toBe("_et_");

    expect(removeProcliticsAccents("quóniam")).toBe("quoniam");
});
