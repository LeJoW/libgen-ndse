import { GenericElement } from "./GenericElement";

export class Cantus extends GenericElement {
    mode: number | undefined;
    incipit: string | undefined;
    scorePath: string = "";
    anchor: string | null = null;

    constructor(file: string) {
        super();
        this.scorePath = file;
    }
}

export class Antiphona extends Cantus {}
export class Hymnus extends Cantus {}
export class Responsorium extends Cantus {}
