libgen.pdf = {
    current_page = nil,
    pages_count = nil,
    path = nil
}

libgen.pdf.open = function(path)
    libgen.pdf.path = path
    libgen.pdf.file = pdfe.open(path)
    libgen.pdf.pages_count = pdfe.getnofpages(libgen.pdf.file)
    libgen.pdf.current_page = 0
end

libgen.pdf.nof_pages = function()
    if libgen.pdf.file == nil then
        return 0
    end
    return libgen.pdf.pages_count
end

libgen.pdf.first_page_height = function()
    local page = pdfe.getpage(libgen.pdf.file, 1)
    local crop = pdfe.getbox(page, "CropBox")
    return crop[4] - crop[2]
end

local print_pdf_page = function(number)
    img.write({
        filename = libgen.pdf.path,
        pagebox = "crop",
        page = number
    })
end

local close_stream_at_end = function()
    if libgen.pdf.current_page == libgen.pdf.pages_count then
        pdfe.close(libgen.pdf.file)
    end
end

libgen.pdf.print_next_page = function()
    libgen.pdf.current_page = libgen.pdf.current_page + 1;
    print_pdf_page(libgen.pdf.current_page)
    close_stream_at_end()
end
