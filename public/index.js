import { View } from './view.js';
import { Logic } from './logic.js';
import { Controller } from './controller.js';
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
            console.debug(dataTheme, preferedTheme, currentTheme, newTheme);
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
        sheet?.insertRule(`.autowidth[autowidth='${type}'] { width: 7ch; transition-duration: 250ms } `);
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
