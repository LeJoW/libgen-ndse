pageCrop = {}

local internalListOfPageHeight = {}
local countOfTranslationLines = 0

local function convertDimension(dim)
    return dim / 65536 * 0.996264009963;
end

local function buildCropBox(width, height)
    return {
        topX = 0,
        topY = convertDimension(pageCrop.paperHeight - height),
        botX = convertDimension(width),
        botY = convertDimension(pageCrop.paperHeight)
    };
end

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

pageCrop.enable = function(paperHeight, paperWidth, translationWidth)
    pageCrop.paperHeight = paperHeight
    pageCrop.paperWidth = paperWidth
    pageCrop.translationWidth = translationWidth
    pageCrop.translationLinesCount = 0
    luatexbase.add_to_callback('post_linebreak_filter', post_linebreak, 'Hook after line break')
end

pageCrop.getCropBoxOfPage = function(page)
    local height = internalListOfPageHeight[page]
    if height == nil then
        return pageCrop.paperHeight
    end
    local width = pageCrop.paperWidth;
    if (page <= pageCrop.translationLinesCount) then
        width = width - pageCrop.translationWidth;
    end
    local dims = buildCropBox(width, height);
    return table.concat({dims.topX, dims.topY, dims.botX, dims.botY}, " ")
end

pageCrop.setLinesTrad = function(num)
    pageCrop.translationLinesCount = num;
end
