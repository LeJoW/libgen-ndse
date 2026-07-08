-- =========================================================================
-- Constantes et Configuration
-- =========================================================================
local NODE_TYPES = {
    HLIST = node.id("hlist"),
    VLIST = node.id("vlist"),
    GLUE = node.id("glue")
}

local DIMENSIONS = {
    SCALED_POINT = 65536, -- 1pt en Sp
    RULE_WIDTH = 26214 -- 0.4pt en Sp
}

local REGISTERS = {
    OUTPUT_PAGE_BOX = 255
}

local ATTRIBUTES = {
    IO_LINE = 37
}

-- =========================================================================
-- Fonctions Utilitaires de Base (Nœuds et Itérateurs)
-- =========================================================================

local function create_list_iterator(list)
    local index = 0
    local count = table.getn(list)
    return function()
        index = index + 1
        if index <= count then
            return list[index]
        end
    end
end

local function is_hlist(current_node)
    return current_node and current_node.id == NODE_TYPES.HLIST
end

local function is_vbox_or_hbox(current_node)
    return current_node.id == NODE_TYPES.HLIST or current_node.id == NODE_TYPES.VLIST
end

local function isolate_node(current_node)
    local clean_node = node.copy(current_node)
    clean_node.next = nil
    clean_node.prev = nil
    return clean_node
end

-- =========================================================================
-- Extraction et Parcours de l'Arbre de Nœuds
-- =========================================================================

local function debug(box)
    local current = box.head

    while current do
        local type_name = node.type(current.id) or "unknown"
        local subtype = current.subtype or 0

        print(string.format("===> Type: %-12s (ID: %2d) | Subtype: %d", type_name, current.id, subtype))

        current = current.next
    end
end

local function extract_lines_from(vbox)
    local lines = {}
    local current = vbox.head
    while current do
        if is_hlist(current) then
            table.insert(lines, isolate_node(current))
        end
        current = current.next
    end
    return lines
end

local function zip_lines(in_lines, out_lines)
    local paired_lines = {}
    local total_pairs = math.max(#in_lines, #out_lines)
    for i = 1, total_pairs do
        table.insert(paired_lines, {
            i = in_lines[i] or nil,
            o = out_lines[i] or nil
        })
    end
    return paired_lines
end

local function scan_node_for_attribute(head, attr_id)
    local nodes_list = {}

    local function search_recursive(current)
        while current do
            local attr_value = node.has_attribute(current, attr_id)
            if attr_value then
                table.insert(nodes_list, {
                    node = current,
                    attr = attr_value
                })
            end

            if is_vbox_or_hbox(current) and current.head then
                search_recursive(current.head)
            end

            current = current.next
        end
    end

    search_recursive(head)
    return nodes_list
end

-- =========================================================================
-- Transformation et Traitement des Lignes
-- =========================================================================

local function is_even_page()
    local current_page = tex.getcount("pageno")
    return current_page % 2 == 0
end

local function check_page_parity(page, line)
    if is_even_page() then
        return
    end

    local right_setting = libgen.iocols:get_line(line.attr)
    if right_setting then
        node.insert_before(page, line.node, right_setting)
        node.remove(page, line.node)
    end
end

local function create_vertical_rule_filler(height)
    local stretch_glue = node.new("glue")
    stretch_glue.stretch = DIMENSIONS.SCALED_POINT
    stretch_glue.stretch_order = 1

    local rule = node.new("rule")
    rule.width = DIMENSIONS.RULE_WIDTH
    rule.height = height
    rule.depth = 0

    local end_glue = node.copy(stretch_glue)

    stretch_glue.next = rule
    rule.next = end_glue

    return stretch_glue
end

local function create_packed_rule_box(line_node, height)
    local components = create_vertical_rule_filler(height)
    local target_width = line_node.width

    local box = node.hpack(components, target_width, "exactly")
    box.height = height
    box.depth = 0
    box.dir = line_node.dir or "TLT"

    return box
end

local function is_glue(node)
    return node and node.id == NODE_TYPES.GLUE;
end

local function replace_glue(page, line)
    if not line.node.next or not line.node.next.next then
        return
    end
    local glue = line.node.next.next;

    if not is_glue(glue) then
        return
    end

    local glue_size = node.effective_glue(glue, page)
    local replacement_box = create_packed_rule_box(line.node, glue_size)

    node.insert_before(page, glue, replacement_box)
    node.remove(page, glue)
end

local function process_single_line(page, line)
    check_page_parity(page, line)
    replace_glue(page, line)
end

local function add_penalties(lines_list)
    local list_with_penalties = lines_list;
    for _, line in ipairs(list_with_penalties) do
        line["penalty"] = 0
    end
    list_with_penalties[#list_with_penalties - 1]["penalty"] = 1000;
    return list_with_penalties;
end

-- =========================================================================
-- API Publique
-- =========================================================================

libgen.iocols = {
    lines_iterator = {},
    all_lines = {},
    lines_count = 0,

    process_lines_from = function(self, inbox_register, outbox_register)
        local inbox = tex.getbox(inbox_register);
        local outbox = tex.getbox(outbox_register);
        local inbox_lines = extract_lines_from(inbox);
        local outbox_lines = extract_lines_from(outbox);

        local lines_list = zip_lines(inbox_lines, outbox_lines);
        lines_list = add_penalties(lines_list);
        self.lines_iterator = create_list_iterator(lines_list);
    end,

    get_next_item = function(self)
        return self.lines_iterator();
    end,

    pageprocess = function()
        local page = tex.getbox(REGISTERS.OUTPUT_PAGE_BOX)
        local lines = scan_node_for_attribute(page.list, ATTRIBUTES.IO_LINE)

        for _, line in ipairs(lines) do
            process_single_line(page, line)
        end
    end,

    add_line = function(self, right_box_register)
        local isolated = isolate_node(tex.getbox(right_box_register))
        table.insert(self.all_lines, isolated)
        self.lines_count = #self.all_lines
    end,

    get_line = function(self, id)
        if not id then
            return nil
        end

        local requested_line = self.all_lines[id]
        self.all_lines[id] = nil
        return requested_line
    end
}
