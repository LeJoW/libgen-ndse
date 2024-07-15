import { Antiphona, Cantus, Hymnus, Responsorium } from "./Cantus";
import { GenericElement } from "./GenericElement";
import { Canticum, Psalmus } from "./Psalterium";

export class GregoIndex extends GenericElement {
    items: (Cantus | Psalmus | Canticum)[] = [];
    psalmi: Psalmus[] = [];
    canti: {
        antiphonae: Antiphona[];
        hymni: Hymnus[];
        responsoria: Responsorium[];
    } = {
        antiphonae: [],
        hymni: [],
        responsoria: [],
    };
    itemsIndex: number = 1;

    addPsalmus(psalm: Psalmus | Canticum): void {
        this.psalmi.push(psalm);
        psalm.anchor = this.generateAnchor(this.itemsIndex++);
    }

    addAntiphona(antiphona: Antiphona) {
        this.canti.antiphonae.push(antiphona);
        antiphona.anchor = this.generateAnchor(this.itemsIndex++);
        this.addItem(antiphona);
    }

    addHymnus(hymnus: Hymnus) {
        this.canti.hymni.push(hymnus);
        hymnus.anchor = this.generateAnchor(this.itemsIndex++);
        this.addItem(hymnus);
    }

    addResponsorium(responsorium: Responsorium) {
        this.canti.responsoria.push(responsorium);
        responsorium.anchor = this.generateAnchor(this.itemsIndex++);
        this.addItem(responsorium);
    }

    getPsalmos(): Psalmus[] {
        return this.getSortedPsalmos().filter(function (item) {
            return !(item instanceof Canticum);
        });
    }

    getCanticos(): Canticum[] {
        return this.getSortedPsalmos().filter(function (item) {
            return item instanceof Canticum;
        });
    }

    private getSortedPsalmos(): Psalmus[] {
        return this.psalmi.sort((a, b) =>
            this.setUpPsalmDivisionForComparaison(
                a.psalmDivision
            ).localeCompare(
                this.setUpPsalmDivisionForComparaison(b.psalmDivision)
            )
        );
    }

    getCantos(): {
        antiphonae: Antiphona[][];
        hymni: Hymnus[][];
        responsoria: Responsorium[][];
    } {
        return {
            antiphonae: this.splitListByIncipitFirstLetter(
                this.getAntiphonas()
            ),
            hymni: this.splitListByIncipitFirstLetter(this.getHymnos()),
            responsoria: this.splitListByIncipitFirstLetter(
                this.getResponsoria()
            ),
        };
    }

    getAntiphonas(): Antiphona[] {
        return this.sortCantorumList(this.canti.antiphonae);
    }

    private getHymnos(): Hymnus[] {
        return this.sortCantorumList(this.canti.hymni);
    }

    private getResponsoria(): Responsorium[] {
        return this.sortCantorumList(this.canti.responsoria);
    }

    private sortCantorumList(list: Cantus[]): Cantus[] {
        return list.sort((a, b) =>
            this.setUpIncipitForComparaison(a.incipit ?? "").localeCompare(
                this.setUpIncipitForComparaison(b.incipit ?? "")
            )
        );
    }

    private splitListByIncipitFirstLetter(list: Cantus[]): Cantus[][] {
        const processGroup = (
            output: Cantus[][],
            remainingList: Cantus[],
            lastLetter: string | null = null,
            currentGroup: Cantus[] = []
        ): Cantus[][] => {
            const currentElement = remainingList.pop();
            if (!currentElement) {
                if (currentGroup.length > 0) {
                    output.push(currentGroup);
                }
                return output;
            }
            const currentLetter = this.getIncipitFirstLetter(
                currentElement.incipit ?? ""
            );
            if (lastLetter !== null && currentLetter !== lastLetter) {
                output.push(currentGroup);
                currentGroup = [];
            }
            currentGroup.push(currentElement);
            return processGroup(
                output,
                remainingList,
                currentLetter,
                currentGroup
            );
        };
        return processGroup([], list.reverse());
    }

    private getIncipitFirstLetter(incipit: string): string {
        return this.setUpIncipitForComparaison(incipit).charAt(0).toLowerCase();
    }

    private setUpIncipitForComparaison(incipit: string): string {
        return incipit.replace(/(æ)/gi, "ae").replace(/(\s+)/, "");
    }

    private addItem(item: Cantus | Psalmus) {
        item.anchor = this.generateAnchor(this.items.push(item));
    }

    private setUpPsalmDivisionForComparaison(ref: string): string {
        return ref.padStart(3, "0").padEnd(4, "a");
    }

    private generateAnchor(id: number): string {
        return `grego-index-item-${id}`;
    }
}
