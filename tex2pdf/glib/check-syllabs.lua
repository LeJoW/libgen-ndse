checkSyllabs = {}

checkSyllabs.of = function(gabc)
    local cmd = 'echo "' .. gabc .. '" | php "' .. pwd .. '/check-syllabs.php"'
    local status, msg = os.execute(cmd)
    if (status == nil) then
        print("--shell-escape must be active to check syllabification")
    end
end
