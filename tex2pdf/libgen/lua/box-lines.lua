libgen.count_lines_of = function(box)
    local b = tex.box[box].list
    local n = 0
    for nodelist in node.traverse(b) do
        if nodelist.id == node.id("hlist") then
            n = n + 1
        end
    end
    return n
end
