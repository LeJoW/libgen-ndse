RecursiveTraversal = {}

local hlist_id = node.id("hlist")
local vlist_id = node.id("vlist")

local function is_box(n)
    return n.id == hlist_id or n.id == vlist_id
end

function RecursiveTraversal.process(head, visitor_callback)
    local function search_recursive(current)
        while current do
            -- 1. On traite le nœud courant via le callback fourni
            visitor_callback(current)

            -- 2. Si c'est une boîte, on plonge récursivement dans son .list
            if is_box(current) and current.list then
                search_recursive(current.list)
            end

            -- 3. On passe au frère suivant
            current = current.next
        end
    end

    search_recursive(head)
end
