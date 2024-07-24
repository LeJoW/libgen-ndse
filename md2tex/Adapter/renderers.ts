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
    renderParagraphStdTRAD,
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

const renderHymnusTRAD = (adapter: Adapter) => renderCantusTRAD(adapter);
const renderAntiphonaTRAD = (adapter: Adapter) => renderCantusTRAD(adapter);
const renderCanticumTRAD = (adapter: Adapter) => renderPsalmusTRAD(adapter);

export const renderersTRAD = [
    renderDayTitleTRAD,
    renderOfficeTitleTRAD,
    renderLessonTitleTRAD,
    renderPsalmTitleTRAD,

    renderCantusTRAD,
    renderHymnusTRAD,
    renderAntiphonaTRAD,

    renderPsalteriumTRAD,
    renderPsalmusTRAD,
    renderCanticumTRAD,

    renderParagraphStdTRAD,
    renderLessonTRAD,
    renderRubricTRAD,

    renderTableOfContentsTRAD,
];
