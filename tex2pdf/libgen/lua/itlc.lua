local glue_id = node.id("glue")
local kern_id = node.id("kern")
local glyph_id = node.id("glyph")
local disc_id = node.id("disc")
local penalty_id = node.id("penalty")

local NodeFilter = {
    is_glyph = function(subnode)
        return subnode.id == glyph_id;
    end,
    is_ignorable = function(subnode)
        return subnode.id == glue_id or subnode.id == kern_id or subnode.id == disc_id -- or subnode.id == penalty_id;
    end
}

local TransitionDetector = {}
TransitionDetector.__index = TransitionDetector

function TransitionDetector.new(on_transition_callback)
    return setmetatable({
        on_transition = on_transition_callback
    }, TransitionDetector)
end

local function find_next_glyph(start_node)
    local curr = start_node.next
    while curr do
        if NodeFilter.is_glyph(curr) then
            return curr
        elseif not NodeFilter.is_ignorable(curr) then
            break
        end
        curr = curr.next
    end
    return nil
end

function TransitionDetector:process_node(subnode)
    -- On s'arrête tout de suite si ce n'est pas un glyphe
    if not NodeFilter.is_glyph(subnode) then
        return
    end

    local next_glyph = find_next_glyph(subnode)
    if not next_glyph then
        return
    end

    local curr_is_italic = FontInspector.is_italic(subnode)
    local next_is_italic = FontInspector.is_italic(next_glyph)

    if curr_is_italic and not next_is_italic then
        if self.on_transition then
            self.on_transition(subnode)
        end
    end
end

local function handle_transition(subnode)
    local itlc = node.new("kern");
    itlc.kern = FontInspector.getitlc(subnode);

    local target = subnode.next
    subnode.next = itlc
    itlc.next = target
end

local detector = TransitionDetector.new(handle_transition)

libgen.itlc = {
    processBox = function(register)
        local page = tex.getbox(register);

        -- On lance le parcours récursif en lui passant une fonction 
        -- qui délègue chaque nœud au détecteur
        RecursiveTraversal.process(page.head, function(node)
            detector:process_node(node)
        end)
    end
}
