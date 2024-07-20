import {
    renderDayTitle,
    renderDayTitleTRAD,
    renderLessonTitle,
    renderLessonTitleTRAD,
    renderOfficeTitle,
    renderOfficeTitleTRAD,
    renderPsalmTitle,
    renderTitle,
} from "./render/titles";
import {
    renderPsalmus,
    renderPsalmusTRAD,
    renderPsalterium,
    renderPsalteriumTRAD,
} from "./render/psalterium";
import {
    renderLesson,
    renderParagraphLettrine,
    renderRubric,
    renderRubricTRAD,
} from "./render/paragraphs";
import { renderCantus, renderCantusTRAD } from "./render/cantus";
import {
    renderTableOfContents,
    renderTableOfContentsTRAD,
} from "./render/tableOfContents";
import { renderGregoIndex } from "./render/gregoIndex";
import { Adapter } from "./Adapter.i";

const renderHymnus = (adapter: Adapter) => renderCantus(adapter);
const renderAntiphona = (adapter: Adapter) => renderCantus(adapter);
const renderResponsorium = (adapter: Adapter) => renderCantus(adapter);

const renderSectionTitle = (adapter: Adapter) => renderTitle(adapter);

export const renderers = [
    renderDayTitle,
    renderOfficeTitle,
    renderLessonTitle,
    renderPsalmTitle,
    renderSectionTitle,
    renderTitle,

    renderCantus,
    renderHymnus,
    renderAntiphona,
    renderResponsorium,

    renderPsalmus,
    renderPsalterium,

    renderParagraphLettrine,
    renderRubric,
    renderLesson,

    renderTableOfContents,
    renderGregoIndex,
];

export const renderersTRAD = [
    renderDayTitleTRAD,
    renderOfficeTitleTRAD,
    renderLessonTitleTRAD,

    renderCantusTRAD,

    renderPsalteriumTRAD,
    renderPsalmusTRAD,

    renderRubricTRAD,

    renderTableOfContentsTRAD,
];
