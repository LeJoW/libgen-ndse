import {
    renderDayTitle,
    renderDayTitleTRAD,
    renderLessonTitle,
    renderLessonTitleTRAD,
    renderOfficeTitle,
    renderOfficeTitleTRAD,
    renderPsalmTitle,
    renderPsalmTitleTRAD,
    renderTitle,
    renderTitleTRAD,
} from "./render/titles";
import {
    renderPsalmus,
    renderPsalmusTRAD,
    renderPsalterium,
    renderPsalteriumTRAD,
} from "./render/psalterium";
import {
    renderLesson,
    renderLessonTRAD,
    renderParagraphLettrine,
    renderParagraphStd,
    renderParagraphStdTRAD,
    renderRemplacementRubric,
    renderRubric,
    renderRubricTRAD,
} from "./render/paragraphs";
import { renderCantus, renderCantusTRAD } from "./render/cantus";
import { renderTableOfContents } from "./render/tableOfContents";
import { renderGregoIndex } from "./render/gregoIndex";
import { Adapter } from "./Adapter.i";

const renderHymnus = (adapter: Adapter) => renderCantus(adapter);
const renderAntiphona = (adapter: Adapter) => renderCantus(adapter);
const renderResponsorium = (adapter: Adapter) => renderCantus(adapter);

const renderCanticum = (adapter: Adapter) => renderPsalmus(adapter);

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
    renderCanticum,
    renderPsalterium,

    renderParagraphStd,
    renderParagraphLettrine,
    renderRubric,
    renderLesson,
    renderRemplacementRubric,

    renderTableOfContents,
    renderGregoIndex,
];

const renderHymnusTRAD = (adapter: Adapter) => renderCantusTRAD(adapter);
const renderAntiphonaTRAD = (adapter: Adapter) => renderCantusTRAD(adapter);
const renderCanticumTRAD = (adapter: Adapter) => renderPsalmusTRAD(adapter);

const renderSectionTitleTRAD = (adapter: Adapter) => renderTitleTRAD(adapter);

export const renderersTRAD = [
    renderDayTitleTRAD,
    renderOfficeTitleTRAD,
    renderLessonTitleTRAD,
    renderPsalmTitleTRAD,
    renderSectionTitleTRAD,
    renderTitleTRAD,

    renderCantusTRAD,
    renderHymnusTRAD,
    renderAntiphonaTRAD,

    renderPsalteriumTRAD,
    renderPsalmusTRAD,
    renderCanticumTRAD,

    renderParagraphStdTRAD,
    renderLessonTRAD,
    renderRubricTRAD,
];
