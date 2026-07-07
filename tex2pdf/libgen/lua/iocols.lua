function list_iter(t)
    local i = 0
    local n = table.getn(t)
    return function()
        i = i + 1
        if i <= n then
            return t[i]
        end
    end
end

local HLIST_NODE_ID = node.id("hlist")
local VLIST_NODE_ID = node.id("vlist")
local GLUE_NODE_ID = node.id("glue")

local function is_hlist(current_node)
    return current_node and current_node.id == HLIST_NODE_ID
end

local function isolate_node(current_node)
    local clean_node = node.copy(current_node)
    clean_node.next = nil
    clean_node.prev = nil
    return clean_node
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

    -- On déclare la fonction de manière locale
    local function rec(current)
        while current do
            -- 1. On vérifie si le nœud actuel possède l'attribut
            local val = node.has_attribute(current, attr_id)
            if val then
                table.insert(nodes_list, {
                    node = current,
                    attr = val
                })
            end

            -- 2. Si c'est une boîte, on plonge récursivement dans sa liste
            if current.id == HLIST_NODE_ID or current.id == VLIST_NODE_ID then
                if current.head then
                    rec(current.head)
                end
            end

            current = current.next
        end
    end

    -- On lance la récursion sur la tête de liste
    rec(head)

    -- On renvoie enfin la table unique qui a été remplie au fur et à mesure
    return nodes_list
end

function check_page_parity(page, line)
    local pageno = tex.getcount("pageno");
    if pageno % 2 == 0 then
        return
    end
    local right_setting = libgen.iocols:get_line(line.attr);
    if right_setting then
        node.insert_before(page, line.node, right_setting);
        node.remove(page, line.node)
    end
end

function replace_glue(page, line)
    local glue = line.node.next
    if glue and glue.id == GLUE_NODE_ID then
        local size = node.effective_glue(glue, page)

        -- 1. Créer les composants internes d'abord
        local hfil1 = node.new("glue")
        hfil1.stretch = 65536
        hfil1.stretch_order = 1

        local rule = node.new("rule")
        rule.width = 26214 -- 0.4pt
        rule.height = size
        rule.depth = 0

        local hfil2 = node.copy(hfil1)

        -- Chaîner les enfants
        hfil1.next = rule
        rule.next = hfil2

        -- 2. Utiliser node.hpack pour "empaqueter" la boîte comme le ferait \hbox to \hsize
        -- "exactly" spécifie qu'on veut une taille précise (comme "to" en TeX)
        local target_width = line.node.width
        local box = node.hpack(hfil1, target_width, "exactly")

        -- 3. Ajuster la hauteur, profondeur et direction de la boîte résultante
        box.height = size
        box.depth = 0
        box.dir = line.node.dir or "TLT"

        -- 4. Remplacement du nœud de colle d'origine
        node.insert_before(page, glue, box)
        node.remove(page, glue)
    end
end

function line_process(page, line)
    check_page_parity(page, line);
    replace_glue(page, line)
end

libgen.iocols = {
    lines_iterator = {},

    store_lines_from = function(self, inbox_register, outbox_register)
        local inbox_lines = extract_lines_from(tex.getbox(inbox_register))
        local outbox_lines = extract_lines_from(tex.getbox(outbox_register))

        local lines_list = zip_lines(inbox_lines, outbox_lines)
        self.lines_iterator = list_iter(lines_list);
    end,

    get_next_item = function(self)
        return self.lines_iterator();
    end,

    pageprocess = function()
        local page = tex.getbox(255);
        local iolineattr = 37;
        local lines = scan_node_for_attribute(page.list, iolineattr);
        for _, line in ipairs(lines) do
            line_process(page, line)
        end
    end,

    line_count = 0,
    all_lines = {},

    add_line = function(self, right)
        table.insert(self.all_lines, isolate_node(tex.getbox(right)));
        self.line_count = #self.all_lines;
    end,

    get_line = function(self, id)
        if not id then
            return nil
        end

        local output = self.all_lines[id]
        self.all_lines[id] = nil
        return output
    end
}
