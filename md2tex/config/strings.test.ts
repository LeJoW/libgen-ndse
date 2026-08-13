import { needsItalicCorrection } from "./strings";

test("italic correction", function () {
    expect(needsItalicCorrection(" ")).toBe(true);
    expect(needsItalicCorrection("a")).toBe(true);
    expect(needsItalicCorrection(".")).toBe(false);
    expect(needsItalicCorrection(",")).toBe(false);
    expect(needsItalicCorrection("=")).toBe(false);
    expect(needsItalicCorrection("")).toBe(false);
});
