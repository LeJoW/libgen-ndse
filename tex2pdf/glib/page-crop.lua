pageCrop = {}

local internalListOfPageHeight = {}

local function debug(message)
    -- print(message)
end
local function post_linebreak(head)
    local total_height = 0;
    while head do
        if head.id == node.id("hlist") then
            local height = head.height
            local depth = head.depth
            total_height = height + depth
            if total_height > 0 then
                table.insert(internalListOfPageHeight, total_height)
            end
        end
        debug("-------------------------")
        debug(head)
        debug(total_height)
        head = head.next
    end
    debug("+++++++++++++++++++++++++")
    debug(head)
    debug(total_height)
    return true
end

pageCrop.enable = function()
    luatexbase.add_to_callback('post_linebreak_filter', post_linebreak, 'Hook after line break')
end

pageCrop.getHeightOfPage = function(page)
    local height = internalListOfPageHeight[page]
    if height == nil then
        return tex.paperheight
    end
    return height
end
