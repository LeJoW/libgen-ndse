<?php

function getSyllabsFromGABC(string $gabc): array
{
    $withoutLineBreak = preg_replace("/\s*[\n\v]\s*/", "", $gabc);
    $withoutCommands = preg_replace("/\\\([^\s]+)?/", "", $withoutLineBreak);
    $withoutNotes = preg_replace("/\(.*\)/U", "=", $withoutCommands);
    $withoutStrings = preg_replace("/<\/?.+>/U", "=", $withoutNotes);
    $withoutSpecialChars = preg_replace("/[^a-z=\sáéíóúýäëïöüÿæœǽœ́]/i", "", $withoutStrings);
    $withoutSpecialChars = preg_replace("/=+/", "=", $withoutSpecialChars);
    $wordsRaw = preg_split("/\s/", $withoutSpecialChars, -1, PREG_SPLIT_NO_EMPTY);
    $wordsTrimed = array_map(function ($word) {
        $word = strtolower($word);
        return trim($word, " \n\r\t\v\0=");
    }, $wordsRaw);
    $filterd = array_filter($wordsTrimed);
    return array_values($filterd);
}

function getWordsFromSyllabs(array $syllabifiedWords): array
{
    return array_map(function ($word) {
        return str_replace("=", "", $word);
    }, $syllabifiedWords);
}

function getSyllabsFromWords(array $wordsList): array
{
    $raw_words = join("\n", $wordsList);
    $compute_hyphenated_words = `echo "$raw_words" | example ../../process/tex2pdf/hyphen/hyph_la_VA_all.dic /dev/stdin`;
    $raw_list = preg_split("/\n/", $compute_hyphenated_words, -1, PREG_SPLIT_NO_EMPTY);
    $trimed_list = array_map(function ($word) {
        return trim($word);
    }, $raw_list);
    $filterd = array_filter($trimed_list);
    return array_values($filterd);
}

function cmp(array $wordsA, array $wordsB): array
{
    return array_reduce(array_keys($wordsA), function (array $acc, int $key) use ($wordsA, $wordsB): array {
        if ($wordsA[$key] !== $wordsB[$key]) {
            return [...$acc, [$wordsA[$key], $wordsB[$key]]];
        }
        return $acc;
    }, []);
}

$input = file_get_contents("php://stdin");
$wordsTarget = getSyllabsFromGABC($input);
$words = getWordsFromSyllabs($wordsTarget);
$wordsSource = getSyllabsFromWords($words);

$diff = cmp($wordsSource, $wordsTarget);

if (!empty($diff)) {
    echo join(PHP_EOL, [
        "",
        "",
        "SYLLABIFICATION ERRORS",
        "",
        "shoud be" . "\t" . "given",
        "=========================",
        ...array_map(function ($word) {
            return $word[0] . "\t" . $word[1];
        }, $diff),
        "",
        "",
    ]);
}
