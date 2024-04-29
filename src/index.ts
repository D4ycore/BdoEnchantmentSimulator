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

// sets up the color scheme button
function initColorSchemeButton() {
	const color_scheme_button = document.querySelector<HTMLButtonElement>('#bColorScheme');
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

// determines if the user has a set theme
function detectColorScheme() {
	let theme = 'light'; //default to light

	//local storage is used to override OS theme settings
	if (localStorage.getItem('theme')) {
		if (localStorage.getItem('theme') == 'dark') {
			theme = 'dark';
		}
	} else if (!window.matchMedia) {
		//matchMedia method not supported
		return false;
	} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		//OS theme setting detected as dark
		theme = 'dark';
	}

	//dark theme preferred, set document with a `data-theme` attribute
	if (theme == 'dark') {
		document.documentElement.setAttribute('data-theme', 'dark');
	}
}
detectColorScheme();

// sets up elements which width should be adjusted automatically
function initAutoWidth() {
	const autoWidthRulesTypes: Set<string> = new Set();
	const autoWidthRules: Map<string, CSSStyleRule> = new Map();

	const sheet = document.styleSheets[0];
	const rules = sheet?.cssRules;

	const lAutoWidth = document.querySelectorAll<HTMLInputElement>('.autowidth');
	lAutoWidth.forEach(elt => {
		const type = elt.getAttribute('autowidth') ?? '';
		autoWidthRulesTypes.add(type);
		elt.oninput = () => checkAutoWidth(type);
	});

	for (const type of autoWidthRulesTypes) sheet?.insertRule(`.autowidth[autowidth='${type}'] { width: 7ch; transition-duration: var(--timing-long) } `);

	if (!rules) return;
	for (const type of autoWidthRulesTypes) {
		for (const rule of rules) if (rule instanceof CSSStyleRule && rule.selectorText === `.autowidth[autowidth="${type}"]`) autoWidthRules.set(type, rule);
	}

	function checkAutoWidth(type: string) {
		let maxWidth = 0;
		lAutoWidth.forEach(elt => {
			if (elt.getAttribute('autowidth') === type && maxWidth < elt.value.length) maxWidth = elt.value.length;
		});
		const rule = autoWidthRules.get(type);
		if (!rule) return;
		rule.style.width = Math.max(2, maxWidth) + 5 + 'ch';
	}
}
initAutoWidth();

function initStickyHeader() {
	const header = document.getElementById('header');
	if (!header) return;

	let sticky: number;
	let isSticky = false;

	window.onscroll = () => {
		if (!isSticky) sticky = header.offsetTop;
		if (window.scrollY > sticky) {
			header.classList.add('fixed-header');
			isSticky = true;
		} else {
			header.classList.remove('fixed-header');
			isSticky = false;
		}
	};
}
initStickyHeader();
