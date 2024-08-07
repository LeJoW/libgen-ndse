import { PsalmCache as PsalmCacheInterface } from "./PsalmCache.i";
import { System } from "./System.i";
import { tons, tonType } from "./tons";

export class PsalmCache implements PsalmCacheInterface {
    path: string;
    system: System;

    constructor(path: string, system: System) {
        this.path = path;
        this.system = system;
    }

    setPsalmBuild(
        psalmDivision: string,
        ton: string,
        psalm: string[]
    ): boolean {
        if (tons[ton] === undefined) {
            return false;
        }
        return this.system.writeJSON(
            this.nameFromPsalmInfo(psalmDivision, tons[ton]),
            psalm
        );
    }
    getPsalmBuild(psalmDivision: string, ton: string): false | string[] {
        try {
            return this.system.readJSON(
                this.nameFromPsalmInfo(psalmDivision, tons[ton])
            );
        } catch (e) {}
        return false;
    }

    private nameFromPsalmInfo(psalmDivision: string, ton: tonType): string {
        const signature = [
            ton.mediante[0],
            ton.mediante[1],
            ton.mediante[2] ? 1 : 0,
            ton.end[0],
            ton.end[1],
            ton.end[2] ? 1 : 0,
        ].join("");
        return `${this.path}/${psalmDivision}-${signature}.json`;
    }
}
