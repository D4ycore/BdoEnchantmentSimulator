import View from './view/View.js';
import Logic from './logic/Logic.js';
import Controller from './controller/Controller.js';
import Logger from './util/Logger.js';
function init() {
    Logger.showDebugs = true;
    console.warn('Construct View');
    const view = new View();
    console.warn('Construct Logic');
    const logic = new Logic();
    console.warn('Construct Controller');
    const controller = new Controller(view, logic);
    console.warn('Link View');
    view.link(controller);
    console.warn('Link Logic');
    logic.link(controller);
    console.warn('Init View');
    view.init();
    console.warn('Init Logic');
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
    for (const type of autoWidthRulesTypes)
        sheet?.insertRule(`.autowidth[autowidth='${type}'] { width: 7ch; transition-duration: var(--timing-long) } `);
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
        rule.style.width = Math.max(2, maxWidth) + 5 + 'ch';
    }
}
initAutoWidth();
