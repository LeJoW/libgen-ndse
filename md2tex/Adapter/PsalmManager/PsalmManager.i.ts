import { Adapter } from "../Adapter.i";
import { Psalmus } from "../../Types/Psalterium";
import { PsalmList } from "../../../buildPsalm/PsalmList.i";
import { PsalmCache } from "../../../buildPsalm/PsalmCache.i";
import { PsalmBuilder } from "../../../buildPsalm/PsalmBuilder";

export interface PsalmManager {
    adapter: Adapter;
    psalmList: PsalmList;
    cache: PsalmCache;
    psalmBuilder: PsalmBuilder;

    setUpPsalm(psalm: Psalmus): void;
}
