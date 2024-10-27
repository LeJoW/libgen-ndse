import { removeProcliticsAccents, testFunctions } from "./proclitics";
const { trimWord, detectProclitic, removeAccents } = testFunctions;

test("trim Word", function () {
    expect(trimWord("ét")).toBe("ét");
    expect(trimWord("*ét*")).toBe("ét");
});

test("remove accents", function () {
    expect(removeAccents("ét")).toBe("et");
    expect(removeAccents("Ét")).toBe("Et");
    expect(removeAccents("Útinam")).toBe("Utinam");
});

test("proclitic Detection", function () {
    expect(detectProclitic("ét")).toBe(true);
    expect(detectProclitic("Útinam")).toBe(true);
});

test("Proclitics", function () {
    expect(removeProcliticsAccents("ét")).toBe("et");
    expect(removeProcliticsAccents("métipsi")).toBe("métipsi");
    expect(removeProcliticsAccents("*ét*")).toBe("*et*");
    expect(removeProcliticsAccents("_ét_")).toBe("_et_");

    expect(removeProcliticsAccents("quóniam")).toBe("quoniam");
    expect(removeProcliticsAccents("Útinam")).toBe("Utinam");
});
