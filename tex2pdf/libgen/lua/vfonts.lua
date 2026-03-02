local function patch_aeacute(tfm)
    -- si la fonte fournit déjà U+01FD, ne rien faire
    if tfm.characters[0x01FD] then
        return
    end


    -- uniquement si æ (base) + accent combinant sont présents
    local base = 0x00E6
    local accent = 0x00B4
    local aacute = 0x00E1

    local base_glyph = tfm.characters[base]
    local accent_glyph = tfm.characters[accent]
    local aacute_glyph = tfm.characters[aacute]

    if not base_glyph or not accent_glyph then
        texio.write_nl("log", "[plantin-ǽ] missing components in font.")
        return
    end

    local quad = tfm.parameters.quad or 1000

    tfm.characters[0x01FD] = {
        width = base_glyph.width,
        height = aacute_glyph.height,
        depth = base_glyph.depth,
        commands = {{"char", base}, {"right", -0.47 * quad}, {"char", accent}}
    }

    texio.write_nl("log", "[patch-font] Added missing ǽ (U+01FD)")
end

libgen.addPlantin_aeacute = patch_aeacute
