import { Antiphona, Cantus, Hymnus, Responsorium } from "./Cantus";
import { GenericElement } from "./GenericElement";
import { Canticum, Psalmus } from "./Psalterium";

export class GregoIndex extends GenericElement {
    items: (Cantus | Psalmus | Canticum)[] = [];
    psalmi: { [num: string]: Psalmus[] } = {};
    cantica: GregoIndex["psalmi"] = {};
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

    addPsalmus(psalm: Psalmus): void {
        this.addPsalmusOrCanticum(psalm, this.psalmi);
    }

    addCanticum(canticum: Canticum): void {
        this.addPsalmusOrCanticum(canticum, this.cantica);
    }

    private addPsalmusOrCanticum(
        psalm: Psalmus,
        storage: GregoIndex["psalmi"]
    ): void {
        const currentDivision = (storage[psalm.psalmDivision] =
            storage[psalm.psalmDivision] ?? []);
        currentDivision.push(psalm);
        psalm.anchor = this.generateAnchor(this.itemsIndex++);
    }

    addAntiphona(antiphona: Antiphona) {
        this.canti.antiphonae.push(antiphona);
        antiphona.anchor = this.generateAnchor(this.itemsIndex++);
    }

    addHymnus(hymnus: Hymnus) {
        this.canti.hymni.push(hymnus);
        hymnus.anchor = this.generateAnchor(this.itemsIndex++);
    }

    addResponsorium(responsorium: Responsorium) {
        this.canti.responsoria.push(responsorium);
        responsorium.anchor = this.generateAnchor(this.itemsIndex++);
    }

    getPsalmos(): GregoIndex["psalmi"] {
        return this.sortPsalmorumList(this.psalmi);
    }

    getCanticos(): GregoIndex["psalmi"] {
        return this.sortPsalmorumList(this.cantica);
    }

    private sortPsalmorumList(
        storage: GregoIndex["psalmi"]
    ): GregoIndex["psalmi"] {
        const sortedKeys = Object.keys(storage).sort((a, b) =>
            this.setUpPsalmDivisionForComparaison(a).localeCompare(
                this.setUpPsalmDivisionForComparaison(b)
            )
        );
        return sortedKeys.reduce(
            (acc, key) => ({ ...acc, [key]: storage[key] }),
            {}
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

    private setUpPsalmDivisionForComparaison(ref: string): string {
        return ref.padStart(3, "0").padEnd(4, "a");
    }

    private generateAnchor(id: number): string {
        return `grego-index-item-${id}`;
    }
}
