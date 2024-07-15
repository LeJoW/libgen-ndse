import { Cantus } from "./Cantus";
import { GenericElement } from "./GenericElement";
import { Psalmus } from "./Psalterium";

export class GregoIndex extends GenericElement {
    items: (Cantus | Psalmus)[] = [];

    addPsalm(psalm: Psalmus): void {
        psalm.anchor = this.generateAnchor(this.items.push(psalm));
    }

    addCantus(cantus: Cantus): void {
        cantus.anchor = this.generateAnchor(this.items.push(cantus));
    }

    private generateAnchor(id: number): string {
        return `grego-index-item-${id}`;
    }
}
