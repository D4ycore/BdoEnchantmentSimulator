import Logic from '../logic/Logic.js';
import View from '../view/View.js';
import Setter from './Setter.js';

export default class Pity {
	current: Setter<number>;
	max: Setter<number>;

	constructor(index: number, view: View, logic: Logic) {
		this.current = new Setter<number>(0, (oldPityCurrent, newPityCurrent) => view.enchantmentItem_Pity_Current_Set(index, oldPityCurrent, newPityCurrent));
		this.max = new Setter<number>(0, (oldPityMax, newPityMax) => view.enchantmentItem_Pity_Max_Set(index, oldPityMax, newPityMax));
	}
}
