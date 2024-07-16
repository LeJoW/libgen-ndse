import { readFileSync } from "fs";
import { PsalmList as PsalmListInterface } from "./PsalmList.i";
import { System } from "./System.i";

export class PsalmList implements PsalmListInterface {
    path: string;
    system: System;

    doxologie = [
        { la: ["Glória Patri, et Fílio,", "et Spirítui Sancto."] },
        {
            la: [
                "Sicut erat in princípio, et nunc, et semper,",
                "et in sǽcula sæculórum. Amen.",
            ],
        },
    ];

    constructor(path: string, system: System) {
        this.path = path;
        this.system = system;
    }

    getPsalm(psalmDivision: string): { la: string[]; fr?: string }[] {
        let psalm;
        try {
            psalm = this.system.readJSON(`${this.path}/${psalmDivision}.json`);
        } catch (error) {
            throw new Error(`The psalm '${psalmDivision}' is not stored`);
        }
        return [...psalm, ...this.doxologie];
    }
}
