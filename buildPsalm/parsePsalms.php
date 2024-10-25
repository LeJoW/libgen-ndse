<?php

$input = file_get_contents("php://stdin");

$psalmWithVersesPerLigne = preg_replace("/(\s*\n\s+)/", "=", $input);
$psalmWithVersesPerLigne = preg_replace("/(\n\\$)/", " $", $psalmWithVersesPerLigne);

$psalm = preg_split("/\n/", $psalmWithVersesPerLigne, -1, PREG_SPLIT_NO_EMPTY);

$output = array_map(function (string $verse): array {
    $translation = preg_replace("/.*(?:\\$(.*)\\$)?\s*/U", "$1", $verse);
    $verse = preg_replace("/\s*\\$.+/", "", $verse);
    return ["la" => preg_split("/\s*[=+]\s*/", $verse), "fr" => $translation];
}, $psalm);

echo json_encode($output);
