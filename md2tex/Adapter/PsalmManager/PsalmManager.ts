import { PsalmBuilder } from "../../../buildPsalm/PsalmBuilder";
import { PsalmCache } from "../../../buildPsalm/PsalmCache";
import { PsalmList } from "../../../buildPsalm/PsalmList";
import { Syllabifier } from "../../../buildPsalm/Syllabifier";
import { System } from "../../../buildPsalm/System";
import { Psalmus } from "../../Types/Psalterium";
import { Adapter } from "../Adapter";
import { PsalmManager as PsalmManagerInterface } from "./PsalmManager.i";

export class PsalmManager implements PsalmManagerInterface {
    adapter: Adapter;
    psalmList: PsalmList;
    cache: PsalmCache;
    psalmBuilder: PsalmBuilder;

    constructor(
        {
            psalmListPath,
            psalmCachePath,
            syllabifierDicPath,
        }: {
            psalmListPath: string;
            psalmCachePath: string;
            syllabifierDicPath: string;
        },
        adapter: Adapter
    ) {
        const system = new System();
        this.psalmList = new PsalmList(psalmListPath, system);
        this.cache = new PsalmCache(psalmCachePath, system);
        this.adapter = adapter;
        this.psalmBuilder = new PsalmBuilder(
            new Syllabifier(syllabifierDicPath),
            this.adapter
        );
    }

    getPsalm(psalm: Psalmus): { la: string[]; fr: (string | undefined)[] } {
        const rawPsalm = this.psalmList.getPsalm(psalm.psalmDivision);
        return {
            la: this.getLatinVersesOf(psalm, rawPsalm),
            fr: this.getFrenchVersesOf(rawPsalm),
        };
    }

    private getLatinVersesOf(
        psalmus: Psalmus,
        content: ReturnType<PsalmList["getPsalm"]>
    ): string[] {
        const ton = psalmus.ton ?? "none";
        const cached = this.cache.getPsalmBuild(psalmus.psalmDivision, ton);
        if (cached) {
            return cached;
        }
        const psalm = this.psalmBuilder.buildPsalm(
            content.map(({ la }) => la),
            ton
        );
        this.cache.setPsalmBuild(psalmus.psalmDivision, ton, psalm);
        return psalm;
    }

    private getFrenchVersesOf(
        psalmContent: ReturnType<PsalmList["getPsalm"]>
    ): (string | undefined)[] {
        return psalmContent.map(({ fr }) => fr);
    }
}
