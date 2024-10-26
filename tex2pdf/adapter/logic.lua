cantus = {}
paragraphs = {}

local function the(dimen)
    return tex.getdimen(dimen)
end

cantus.getPDFpagesCount = function(pdf)
    local doc = pdfe.open(pdf)
    if (doc) then
        return pdfe.getnofpages(doc)
    end
    return 0
end

local function getLastSkip(prevdepth, height)
    local skip = tex.baselineskip.width - (prevdepth + height)
    if (skip < tex.lineskiplimit) then
        return tex.lineskip.width
    end
    return skip
end

local tmpHeightsList = {}
local prevLineDepth = 0
cantus.resetHeightsList = function()
    tmpHeightsList = {}
end
cantus.pushLineHeight = function(lineHeight, lineDepth)
    local lastSkip = 0;
    if (#tmpHeightsList > 0) then
        lastSkip = getLastSkip(prevLineDepth, lineHeight);
    end
    table.insert(tmpHeightsList, lastSkip + lineHeight + lineDepth)
    prevLineDepth = lineDepth
end

function getAdjustedHeight(callback)
    local accumulator = 0
    for line, height in ipairs(tmpHeightsList) do
        accumulator = accumulator + height
        if callback(line, accumulator) then
            break
        end
    end
    return accumulator
end

function getGap(boxHeight, callback)
    local height = getAdjustedHeight(callback)
    local gap = height - the('gregoLineDepth') - boxHeight
    if (gap < 0) then
        gap = 0
    end
    return gap
end

cantus.getLineAdjustedGap = function(boxHeight, lines)
    return getGap(boxHeight, function(line, accumulator)
        return line == lines
    end)
end
cantus.getAutoAdjustedGap = function(boxHeight)
    return getGap(boxHeight, function(line, accumulator)
        return accumulator > boxHeight
    end)
end

paragraphs.getSpaceToPushBottom = function()
    local spaceLeft = (tex.pagegoal - tex.pagetotal) - the('capsHeight')
    local baselineskip = tex.baselineskip.width
    local lineCount = math.floor(spaceLeft / baselineskip)
    local gap = spaceLeft - (baselineskip * lineCount)
    local invertGap = gap - baselineskip
    if lineCount > 1 then
        if gap > the('maxGapToBaselineAlign') and invertGap > the('minGapToBaselineAlign') then
            return invertGap
        end
        return gap
    end
    return invertGap
end
