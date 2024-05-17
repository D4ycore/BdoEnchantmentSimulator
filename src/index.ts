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
	const autoWidthElements: Map<string, HTMLInputElement[]> = new Map();

	const lAutoWidth = document.querySelectorAll<HTMLInputElement>('.autowidth');
	lAutoWidth.forEach(elt => {
		const type = elt.getAttribute('autowidth') ?? '';
		let elements = autoWidthElements.get(type);
		if (!elements) autoWidthElements.set(type, (elements = []));
		elements.push(elt);
		elt.addEventListener('input', checkAutoWidth);
		elt.addEventListener('change', checkAutoWidth);
	});

	function checkAutoWidth() {
		for (const [, elements] of autoWidthElements) {
			let maxWidth = 0;
			for (const elt of elements) if (maxWidth < elt.value.length) maxWidth = elt.value.length;
			for (const elt of elements) elt.style.setProperty('width', Math.max(2, maxWidth) + 5 + 'ch', 'important');
		}
	}
	checkAutoWidth();
}
initAutoWidth();

function initHeaderControl() {
	const cbOptionsButton = document.querySelector<HTMLInputElement>('header .options-button>input');
	const dOptionsWrapper = document.querySelector<HTMLDivElement>('header .options-wrapper');
	const dOptions = document.querySelector<HTMLDivElement>('header .options');
	if (!cbOptionsButton) return Logger.error('No Options Button Element');
	if (!dOptionsWrapper || !dOptions) return Logger.error('No Options Element');
	const updateOptions = () => {
		if (cbOptionsButton.checked) dOptionsWrapper.style.removeProperty('height');
		else dOptionsWrapper.style.setProperty('height', '0');
	};
	cbOptionsButton.addEventListener('change', updateOptions);
	updateOptions();
}
initHeaderControl();
