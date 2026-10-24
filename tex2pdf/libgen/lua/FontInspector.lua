FontInspector = {}

fontsList = {}

loadFontsList = function()
    fontsList.display = font.id("displayfont")
    fontsList.header = font.id("headerfont")
    fontsList.decorativ = font.id("decorativfont")
    fontsList.itdecorativ = font.id("itdecorativfont")
    fontsList.lettrine = font.id("lettrinefont")
    fontsList.smscshape = font.id("smscshapefont")

    fontsList.regular = font.id("regularfont")
    fontsList.scshape = font.id("scshapefont")
    fontsList.italic = font.id("italicfont")
    fontsList.bold = font.id("boldfont")
    fontsList.fr = font.id("frfont")
    fontsList.rubric = font.id("rubricfont")
end

function FontInspector.is_italic(glyph)
    return node.uses_font(glyph, fontsList.italic)
end

function FontInspector.getitlc(n)
    local font_data = font.getfont(fontsList.italic);
    local character_metrics = font_data.characters[n.char]
    return character_metrics.italic or 0
end
