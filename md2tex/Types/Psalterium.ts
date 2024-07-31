import { Cantus } from "./Cantus";
import { GenericElement } from "./GenericElement";
import { PsalmTitle } from "./titles";

export class Psalmus extends GenericElement {
    ton: string | null;
    psalmDivision: string;
    versi: string[] = [];
    intonation: Cantus | false = false;
    doxologie: boolean = true;
    mode: number | null = null;
    incipit: string | undefined = undefined;

    title: PsalmTitle | false = false;
    anchor: string | null = null;

    translation: string[] | false = false;

    constructor(ton: string | null, psalmDivision: string) {
        super(psalmDivision);
        this.ton = ton;
        this.psalmDivision = psalmDivision;
        if (ton) {
            this.mode = parseInt(ton.replace(/^(\d+)/, "$1"));
        }
    }

    setTranslation(title: string): void {
        const psalmTitle = new PsalmTitle("");
        if (!this.title) {
            this.title = psalmTitle;
        }
        this.title.setTranslation(title);
    }

    setVersorumTranslation(versi: (string | undefined)[]): void {
        this.translation = versi as string[];
    }
}

export class Canticum extends Psalmus {}

export class Psalterium extends GenericElement {
    ton: string | null = null;

    psalms: (Psalmus | Canticum)[] = [];

    constructor(ton: string | null) {
        super(ton as string);
        this.ton = ton;
    }

    addPsalm(psalm: Psalmus | Canticum) {
        this.psalms.push(psalm);
    }
}
