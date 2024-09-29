import { Cantus } from "./Cantus";
import { GenericElement } from "./GenericElement";
import { TextNode } from "./TextNode.i";
import { PsalmTitle } from "./titles";

export class Psalmus extends GenericElement {
    ton: string | null;
    psalmDivision: string;
    versi: TextNode[] = [];
    intonation: Cantus | false = false;
    doxologie: boolean = true;
    mode: number | null = null;
    incipit: string | undefined = undefined;

    title: PsalmTitle | false = false;
    anchor: string | null = null;

    constructor(ton: string | null, psalmDivision: string) {
        super();
        this.ton = ton;
        this.psalmDivision = psalmDivision;
        if (ton) {
            this.mode = parseInt(ton.replace(/^(\d+)/, "$1"));
        }
    }

    setTranslation(title: TextNode): void {
        const psalmTitle = new PsalmTitle(title);
        if (!this.title) {
            this.title = psalmTitle;
        }
        this.title.content.fr = title.fr;
    }

    setVersorumTranslation(versi: (string | undefined)[]): void {
        versi.map((versus: string | undefined, index: number) => {
            if (versus) {
                this.versi[index].fr = versus;
            }
        });
    }
}

export class Canticum extends Psalmus {}

export class Psalterium extends GenericElement {
    ton: string | null = null;
    translation: boolean = false;
    psalms: (Psalmus | Canticum)[] = [];

    constructor(ton: string | null) {
        super();
        this.ton = ton;
    }

    addPsalm(psalm: Psalmus | Canticum) {
        this.psalms.push(psalm);
    }
}
