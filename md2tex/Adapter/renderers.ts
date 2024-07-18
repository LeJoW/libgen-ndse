import {
    renderDayTitle,
    renderLessonTitle,
    renderOfficeTitle,
    renderPsalmTitle,
    renderTitle,
} from "./render/titles";
import {
    renderPsalmus,
    renderPsalterium,
    renderPsalteriumTRAD,
} from "./render/psalterium";
import {
    renderLesson,
    renderParagraphLettrine,
    renderRubric,
} from "./render/paragraphs";
import { renderCantus } from "./render/cantus";
import { renderTableOfContents } from "./render/tableOfContents";
import { renderGregoIndex } from "./render/gregoIndex";
import { Adapter } from "./Adapter.i";

const renderHymnus = (adapter: Adapter) => renderCantus(adapter);
const renderAntiphona = (adapter: Adapter) => renderCantus(adapter);
const renderResponsorium = (adapter: Adapter) => renderCantus(adapter);

export const renderers = [
    renderDayTitle,
    renderOfficeTitle,
    renderLessonTitle,
    renderPsalmTitle,
    renderTitle,
    renderCantus,
    renderHymnus,
    renderAntiphona,
    renderResponsorium,
    renderPsalmus,
    renderPsalterium,
    renderPsalteriumTRAD,
    renderParagraphLettrine,
    renderRubric,
    renderLesson,
    renderTableOfContents,
    renderGregoIndex,
];
