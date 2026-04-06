export interface PsalmList {
    getPsalm(psalmDivision: string, doxologie: boolean): { la: string[]; fr?: string }[];
}
