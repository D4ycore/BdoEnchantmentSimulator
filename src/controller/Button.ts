export default class Button {
	private onClick: () => void;

	constructor(onClick: () => void) {
		this.onClick = onClick;
	}

	click() {
		if (this.onClick) this.onClick();
	}
}
