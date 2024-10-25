import { readFile, writeFileSync, readFileSync } from "fs";
import { dirname } from "path";

import blockConfig from "./config/blocks";
import strConfig from "./config/strings";
import { Document } from "./Document/Document";
import { Rules } from "./Rules/Rules";
import Parser from "./Parser/Parser";

import { Command } from "commander";
import { preprocess } from "./config/preprocess";
import { translate } from "./config/translation";
import { TexRender } from "./Render/TexRender";
import { Adapter } from "./Adapter/Adapter";
import { PsalmManager } from "./Adapter/PsalmManager/PsalmManager";

const program = new Command();
const tex = new TexRender();
const adapter = new Adapter(tex);
const psalmManager = new PsalmManager({
    psalmListPath: "buildPsalm/psalms",
    psalmCachePath: "buildPsalm/cache",
    syllabifierDicPath: "tex2pdf/hyphen/hyph_la_VA_all.dic",
});

const rules = new Rules(blockConfig(psalmManager), strConfig(adapter));
rules.preprocessor = preprocess;
rules.translater = translate;
const parser = new Parser(rules, adapter);

function parse(input: string, translation: boolean, output: string) {
    adapter.translation = translation;
    readFile(input, { encoding: "utf-8" }, function (err, list: string) {
        const dir = dirname(input);
        const outputTex = list
            .split("\n")
            .map(function (item: string) {
                const file = item.trim();
                if (file.length > 0) {
                    try {
                        const content = readFileSync(
                            `${dir}/${file}`
                        ).toString();
                        const doc = new Document(content);
                        return parser.parse(doc);
                    } catch (e) {}
                }
            })
            .join("\n\n");
        writeFileSync(output, outputTex);
    });
}

program
    .command("parse")
    .argument("<string>", "path to input file list")
    .option("-t", "enable translate mode")
    .option("-o, --output <string>", "path to output file")
    .action(function (input, options) {
        parse(input, options.t || false, options.output);
    });

program.parse();
