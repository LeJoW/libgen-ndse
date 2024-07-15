import { Cantus } from "./Cantus";
import { GenericElement } from "./GenericElement";
import { Psalmus } from "./Psalterium";

export class GregoIndex extends GenericElement {
    items: (Cantus | Psalmus)[] = [];

    addPsalm(psalm: Psalmus): void {
        this.items.push(psalm);
        psalm.anchor = this.generateAnchor();
    }

    addCantus(cantus: Cantus): void {
        this.items.push(cantus);
        cantus.anchor = this.generateAnchor();
    }

    private generateAnchor(): string {
        return `grego-index-item-${this.items.length}`;
    }
}
