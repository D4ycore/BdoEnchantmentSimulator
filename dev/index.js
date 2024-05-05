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
        color_scheme_button.onclick = evt => {
            const dataTheme = document.documentElement.getAttribute('data-theme');
            const preferedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const currentTheme = dataTheme ?? preferedTheme;
            const newTheme = currentTheme == 'dark' ? 'light' : 'dark';
            Logger.debug(dataTheme, preferedTheme, currentTheme, newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
        };
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
    const autoWidthRulesTypes = new Set();
    const autoWidthRules = new Map();
    const sheet = document.styleSheets[0];
    const rules = sheet?.cssRules;
    const lAutoWidth = document.querySelectorAll('.autowidth');
    lAutoWidth.forEach(elt => {
        const type = elt.getAttribute('autowidth') ?? '';
        autoWidthRulesTypes.add(type);
        elt.oninput = () => checkAutoWidth(type);
    });
    if (!rules)
        return;
    for (const type of autoWidthRulesTypes) {
        for (const rule of rules)
            if (rule instanceof CSSStyleRule && rule.selectorText === `.autowidth[autowidth="${type}"]`)
                autoWidthRules.set(type, rule);
    }
    function checkAutoWidth(type) {
        let maxWidth = 0;
        lAutoWidth.forEach(elt => {
            if (elt.getAttribute('autowidth') === type && maxWidth < elt.value.length)
                maxWidth = elt.value.length;
        });
        const rule = autoWidthRules.get(type);
        if (!rule)
            return;
        rule.style.setProperty('width', Math.max(2, maxWidth) + 4 + 'ch', 'important');
    }
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
        if (cbOptionsButton.checked) {
            console.log('show options');
            dOptionsWrapper.style.removeProperty('height');
        }
        else {
            console.log(dOptions.clientHeight);
            console.log('hide options');
            dOptionsWrapper.style.setProperty('height', '0');
        }
    };
    cbOptionsButton.onchange = updateOptions;
    updateOptions();
}
initHeaderControl();
