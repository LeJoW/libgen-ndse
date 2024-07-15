import { Antiphona, Cantus, Hymnus, Responsorium } from "./Cantus";
import { GenericElement } from "./GenericElement";
import { Canticum, Psalmus } from "./Psalterium";

export class GregoIndex extends GenericElement {
    items: (Cantus | Psalmus | Canticum)[] = [];

    addPsalm(psalm: Psalmus | Canticum): void {
        this.addItem(psalm);
    }

    addAntiphona(antiphona: Antiphona) {
        this.addItem(antiphona);
    }

    addHymnus(hymnus: Hymnus) {
        this.addItem(hymnus);
    }

    addResponsorium(responsorium: Responsorium) {
        this.addItem(responsorium);
    }

    private addItem(item: Cantus | Psalmus) {
        item.anchor = this.generateAnchor(this.items.push(item));
    }

    private generateAnchor(id: number): string {
        return `grego-index-item-${id}`;
    }
}
