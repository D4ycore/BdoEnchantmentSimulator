import Controller from './controller/Controller.js';
import Logic from './logic/Logic.js';
import Logger from './util/Logger.js';
import View from './view/View.js';
function init() {
    const view = new View();
    const logic = new Logic();
    const controller = new Controller(view, logic);
    view.link(controller);
    logic.link(controller);
    view.init();
    logic.init();
}
init();
function initColorSchemeButton() {
    const color_scheme_button = document.querySelector('#bColorScheme');
    if (color_scheme_button)
        color_scheme_button.addEventListener('click', evt => {
            const dataTheme = document.documentElement.getAttribute('data-theme');
            const preferedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const currentTheme = dataTheme ?? preferedTheme;
            const newTheme = currentTheme == 'dark' ? 'light' : 'dark';
            Logger.debug(dataTheme, preferedTheme, currentTheme, newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
        });
}
initColorSchemeButton();
function detectColorScheme() {
    let theme = 'light';
    if (localStorage.getItem('theme')) {
        if (localStorage.getItem('theme') == 'dark') {
            theme = 'dark';
        }
    }
    else if (!window.matchMedia) {
        return false;
    }
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
    }
    if (theme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}
detectColorScheme();
function initAutoWidth() {
    const autoWidthElements = new Map();
    const lAutoWidth = document.querySelectorAll('.autowidth');
    lAutoWidth.forEach(elt => {
        const type = elt.getAttribute('autowidth') ?? '';
        let elements = autoWidthElements.get(type);
        if (!elements)
            autoWidthElements.set(type, (elements = []));
        elements.push(elt);
        elt.addEventListener('input', checkAutoWidth);
        elt.addEventListener('change', checkAutoWidth);
    });
    function checkAutoWidth() {
        for (const [, elements] of autoWidthElements) {
            let maxWidth = 0;
            for (const elt of elements)
                if (maxWidth < elt.value.length)
                    maxWidth = elt.value.length;
            for (const elt of elements)
                elt.style.setProperty('width', Math.max(2, maxWidth) + 5 + 'ch', 'important');
        }
    }
    checkAutoWidth();
}
initAutoWidth();
function initHeaderControl() {
    const cbOptionsButton = document.querySelector('header .options-button>input');
    const dOptionsWrapper = document.querySelector('header .options-wrapper');
    const dOptions = document.querySelector('header .options');
    if (!cbOptionsButton)
        return Logger.error('No Options Button Element');
    if (!dOptionsWrapper || !dOptions)
        return Logger.error('No Options Element');
    const updateOptions = () => {
        if (cbOptionsButton.checked)
            dOptionsWrapper.style.removeProperty('height');
        else
            dOptionsWrapper.style.setProperty('height', '0');
    };
    cbOptionsButton.addEventListener('change', updateOptions);
    updateOptions();
}
initHeaderControl();
