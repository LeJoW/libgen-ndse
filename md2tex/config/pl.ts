import { GenericElement } from "../Types/GenericElement";

class Button implements GenericElement {}

type callback = (element: Required<GenericElement>) => boolean;

const callbck: callback = function (element: Button) {
    return false;
};
