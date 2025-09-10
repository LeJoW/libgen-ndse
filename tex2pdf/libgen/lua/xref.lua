libgen.xref = {}

local function var_serialize(o)
    if type(o) == "number" then
        return o;
    elseif type(o) == "string" then
        return string.format("%q", o)
    end
end

local function serialize(o)
    local stack = {}
    for k, v in pairs(o) do
        table.insert(stack, "[" .. var_serialize(k) .. "]=" .. var_serialize(v))
    end
    return "{" .. table.concat(stack, ";\n") .. "}"
end

-- Save table to file
function save_table(filename, tbl)
    local f, err = io.open(filename, "w")
    local output = "return " .. serialize(tbl)
    if not f then
        return nil, err
    end
    f:write(output)
    f:close()
    return true
end

-- Load table from file
function load_table(filename)
    local ok, result = pcall(dofile, filename)
    if ok then
        return result
    else
        return {}
    end
end

libgen.xref.init = function(filename)
    libgen.xref.file = filename
    libgen.xref.list = load_table(filename)
end

libgen.xref.finish = function()
    save_table(libgen.xref.file, libgen.xref.list)
end

libgen.xref.add_entry = function(label, value)
    libgen.xref.list[label] = value
end

libgen.xref.get_entry = function(label)
    local value = libgen.xref.list[label]
    if value then
        return value
    else
        return "*"
    end
end
