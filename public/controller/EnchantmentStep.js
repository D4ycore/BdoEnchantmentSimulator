import EnchantmentItem from '../logic/EnchantmentItem.js';
import Value from './Value.js';
export class EnchantmentStep {
    constructor(index, view, logic) {
        this.item = new Value(EnchantmentItem.Reblath_Mon, (oldItem, newItem) => view.enchantmentStep_Item_Set(index, oldItem, newItem), (oldItem, newItem) => logic.enchantmentStep_Item_OnChange(index, oldItem, newItem));
        this.startFS = new Value(0, (oldStartFS, newStartFS) => view.enchantmentStep_StartFS_Set(index, oldStartFS, newStartFS), (oldStartFS, newStartFS) => logic.enchantmentStep_StartFS_OnChange(index, oldStartFS, newStartFS));
        this.endFS = new Value(0, (oldEndFS, newEndFS) => view.enchantmentStep_EndFS_Set(index, oldEndFS, newEndFS), (oldEndFS, newEndFS) => logic.enchantmentStep_EndFS_OnChange(index, oldEndFS, newEndFS));
        this.clicks = new Value(0, (oldClicks, newClicks) => view.enchantmentStep_Clicks_Set(index, oldClicks, newClicks), (oldClicks, newClicks) => logic.enchantmentStep_Clicks_OnChange(index, oldClicks, newClicks));
    }
}
