import Setter from './Setter.js';
export default class Pity {
    constructor(index, view, logic) {
        this.current = new Setter(newPityCurrent => view.enchantmentItem_Pity_Current_Set(index, newPityCurrent));
        this.max = new Setter(newPityMax => view.enchantmentItem_Pity_Max_Set(index, newPityMax));
    }
}
