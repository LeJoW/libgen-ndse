export interface PsalmList {
    getPsalm(psalmDivision: string): { la: string[]; fr?: string }[];
}
