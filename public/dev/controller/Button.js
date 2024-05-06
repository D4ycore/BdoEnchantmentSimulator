export default class Button {
    constructor(onClick) {
        this.onClick = onClick;
    }
    click() {
        if (this.onClick)
            this.onClick();
    }
}
