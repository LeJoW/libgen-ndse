libgen = {}

dofile('libgen/lua/pdf.lua')
dofile('libgen/lua/xref.lua')
dofile('libgen/lua/box-lines.lua')
dofile('libgen/lua/vfonts.lua')

luatexbase.add_to_callback("luaotfload.patch_font", libgen.addPlantin_aeacute, "libgen.addPlantin_aeacute")
