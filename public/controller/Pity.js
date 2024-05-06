import Value from './Value.js';
export default class Pity {
    constructor(index, view, logic) {
        this.current = new Value(0, (oldPityCurrent, newPityCurrent) => view.enchantmentItem_Pity_Current_Set(index, oldPityCurrent, newPityCurrent), (oldPityCurrent, newPityCurrent) => logic.enchantmentItem_Pity_Current_OnChange(index, oldPityCurrent, newPityCurrent));
        this.max = new Value(0, (oldPityMax, newPityMax) => view.enchantmentItem_Pity_Max_Set(index, oldPityMax, newPityMax), (oldPityMax, newPityMax) => logic.enchantmentItem_Pity_Max_OnChange(index, oldPityMax, newPityMax));
    }
}
