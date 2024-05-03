import Setter from './Setter.js';
export default class Pity {
    constructor(index, view, logic) {
        this.current = new Setter(0, (oldPityCurrent, newPityCurrent) => view.enchantmentItem_Pity_Current_Set(index, oldPityCurrent, newPityCurrent));
        this.max = new Setter(0, (oldPityMax, newPityMax) => view.enchantmentItem_Pity_Max_Set(index, oldPityMax, newPityMax));
    }
}
