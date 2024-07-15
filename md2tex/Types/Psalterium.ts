import { PsalmBuilder } from "../../buildPsalm/PsalmBuilder";
import { Cantus } from "./Cantus";
import { GenericElement } from "./GenericElement";

export class Psalmus extends GenericElement {
    psalmDivision: string;
    versi: string[];
    doxologie: boolean = true;
    mode: number | null = null;

    title: string | false = false;
    anchor: string | null = null;

    constructor(
        ton: string | null,
        psalmDivision: string,
        psalmBuilder: PsalmBuilder
    ) {
        super(psalmDivision);
        this.psalmDivision = psalmDivision;
        this.versi = psalmBuilder.buildPsalm(psalmDivision, ton ?? "none");
        if (ton && ton.length > 0) {
            this.mode = parseInt(ton.replace(/^(\d+)/, "$1"));
        }
    }
}

export class Psalterium extends GenericElement {
    ton: string | null = null;
    intonation: Cantus | false = false;

    psalms: Psalmus[] = [];

    constructor(ton: string | null) {
        super(ton as string);
        this.ton = ton;
    }

    addPsalm(psalm: Psalmus) {
        if (this.psalms.length === 0 && this.ton) {
            this.intonation = new Cantus(`${psalm.psalmDivision}-${this.ton}`);
        }
        this.psalms.push(psalm);
    }
}
