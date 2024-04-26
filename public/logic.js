import { BLACKSTART_MON, BUY_FS_10, BUY_FS_15, BUY_FS_20, BUY_FS_25, BUY_FS_30, BUY_FS_5, CONCENTRATED, DEBUG, FLAWLESSMAGICALBLACKSTONE, MEMORYFRAGMENT } from './constants.js';
import { EnchantmentItem } from './enhance_item.js';
import { logger } from './logger.js';
import { TEST_RNG } from './test_rng.js';
import { nf } from './util.js';
class FailStack {
    constructor(tier = 0, amount = 0, value = 0) {
        this.tier = tier;
        this.amount = amount;
        this.value = value;
    }
}
class EnchantmentStep2 {
    constructor(stepIndex, controller) {
        const step = controller.getEnchantmentStep(stepIndex);
        this._item = step.item.value();
        this._startFS = step.startFS.value() - controller.getFamilyFS().value();
        this._endFS = step.endFS.value() - controller.getFamilyFS().value();
        this._clicks = step.clicks.value();
    }
    get item() {
        return this._item;
    }
    get startFS() {
        return this._startFS;
    }
    get endFS() {
        return this._endFS;
    }
    get clicks() {
        return this._clicks;
    }
}
export class Logic {
    constructor() {
        this.currentFailstack = new FailStack();
        this.failstacks = new Map();
        this.rand = new TEST_RNG(0);
        this.upgrading = false;
        this.price = 0;
        this.clicks = 0;
    }
    link(controller) {
        this.controller = controller;
    }
    init() {
        for (let i = 1; i < 500; i++) {
            this.failstacks.set(i, new FailStack(i, 0, 0));
        }
        this.setupDemo();
    }
    setupDemo() {
        this.controller.getFamilyFS().value(2);
        this.controller.getBuyFS().value(15);
        this.controller.getTargetAmount().value(10);
        this.controller.getEnchantmentStep(0)?.item.value(EnchantmentItem.Reblath_Mon);
        this.controller.getEnchantmentStep(0)?.clicks.value(5);
        this.controller.getEnchantmentStep(1)?.item.value(EnchantmentItem.Reblath_Duo);
        this.controller.getEnchantmentStep(1)?.clicks.value(4);
        this.controller.getEnchantmentStep(2)?.item.value(EnchantmentItem.Reblath_Tri);
        this.controller.getEnchantmentStep(2)?.clicks.value(9);
        this.controller.getEnchantmentStep(3)?.item.value(EnchantmentItem.Reblath_Tet);
        this.controller.getEnchantmentStep(3)?.clicks.value(18);
        this.controller.getClicksPerIteration().value(10000);
        this.controller.getIterationsPerSecond().value(100);
        for (let n = 0; n < 1000; n++)
            this.addItem('Reblath');
        this.refresh();
        if (DEBUG)
            logger.clear();
    }
    setupSilver() {
        this.controller.getFamilyFS().value(2);
        this.controller.getBuyFS().value(15);
        this.controller.getTargetAmount().value(1000);
        this.controller.getEnchantmentStep(0)?.item.value(EnchantmentItem.Reblath_Mon);
        this.controller.getEnchantmentStep(0)?.clicks.value(5);
        this.controller.getEnchantmentStep(1)?.item.value(EnchantmentItem.Reblath_Duo);
        this.controller.getEnchantmentStep(1)?.clicks.value(4);
        this.controller.getEnchantmentStep(2)?.item.value(EnchantmentItem.Reblath_Tri);
        this.controller.getEnchantmentStep(2)?.clicks.value(3);
        this.controller.getEnchantmentStep(3)?.item.value(EnchantmentItem.Reblath_Tet);
        this.controller.getEnchantmentStep(3)?.clicks.value(23);
        this.controller.getClicksPerIteration().value(10000);
        this.controller.getIterationsPerSecond().value(100);
        for (let n = 0; n < 1000; n++)
            this.addItem('Reblath');
        this.refresh();
        if (DEBUG)
            logger.clear();
    }
    setupOld() {
        this.controller.getFamilyFS().value(2);
        this.controller.getBuyFS().value(20);
        this.controller.getTargetAmount().value(1000);
        this.controller.getEnchantmentStep(0)?.item.value(EnchantmentItem.Reblath_Mon);
        this.controller.getEnchantmentStep(0)?.clicks.value(3);
        this.controller.getEnchantmentStep(1)?.item.value(EnchantmentItem.Reblath_Duo);
        this.controller.getEnchantmentStep(1)?.clicks.value(4);
        this.controller.getEnchantmentStep(2)?.item.value(EnchantmentItem.Reblath_Tri);
        this.controller.getEnchantmentStep(2)?.clicks.value(6);
        this.controller.getEnchantmentStep(3)?.item.value(EnchantmentItem.Reblath_Tet);
        this.controller.getEnchantmentStep(3)?.clicks.value(21);
        this.controller.getClicksPerIteration().value(10000);
        this.controller.getIterationsPerSecond().value(100);
        for (let n = 0; n < 1000; n++)
            this.addItem('Reblath');
        this.refresh();
        if (DEBUG)
            logger.clear();
    }
    addItem(item) {
        logger.debug('addItem', item);
        switch (item) {
            case 'Reblath':
                EnchantmentItem.Reblath_Mon.amount = EnchantmentItem.Reblath_Mon.amount + 10;
                break;
            case 'Blackstar':
                EnchantmentItem.Blackstar_Mon.amount++;
                EnchantmentItem.Blackstar_Mon.value += BLACKSTART_MON;
                break;
        }
    }
    refresh() {
        logger.debug('refresh', this.currentFailstack);
        const monReblathText = this.controller.getEnchantmentItem(0);
        const duoReblathText = this.controller.getEnchantmentItem(1);
        const triReblathText = this.controller.getEnchantmentItem(2);
        const tetReblathText = this.controller.getEnchantmentItem(3);
        const penReblathText = this.controller.getEnchantmentItem(4);
        const monReblathPity = this.controller.getEnchantmentItem(0).pity;
        monReblathPity.current.value(EnchantmentItem.Reblath_Mon.pity.current);
        monReblathPity.max.value(EnchantmentItem.Reblath_Mon.pity.max);
        const duoReblathPity = this.controller.getEnchantmentItem(1).pity;
        duoReblathPity.current.value(EnchantmentItem.Reblath_Duo.pity.current);
        duoReblathPity.max.value(EnchantmentItem.Reblath_Duo.pity.max);
        const triReblathPity = this.controller.getEnchantmentItem(2).pity;
        triReblathPity.current.value(EnchantmentItem.Reblath_Tri.pity.current);
        triReblathPity.max.value(EnchantmentItem.Reblath_Tri.pity.max);
        const tetReblathPity = this.controller.getEnchantmentItem(3).pity;
        tetReblathPity.current.value(EnchantmentItem.Reblath_Tet.pity.current);
        tetReblathPity.max.value(EnchantmentItem.Reblath_Tet.pity.max);
        monReblathText.amount.value(EnchantmentItem.Reblath_Mon.amount);
        duoReblathText.amount.value(EnchantmentItem.Reblath_Duo.amount);
        triReblathText.amount.value(EnchantmentItem.Reblath_Tri.amount);
        tetReblathText.amount.value(EnchantmentItem.Reblath_Tet.amount);
        penReblathText.amount.value(EnchantmentItem.Reblath_Pen.amount);
        penReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Pen.total_value / EnchantmentItem.Reblath_Pen.total_amount / 1000000, 2));
        tetReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Tet.total_value / EnchantmentItem.Reblath_Tet.total_amount / 1000000, 2));
        triReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Tri.total_value / EnchantmentItem.Reblath_Tri.total_amount / 1000000, 2));
        duoReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Duo.total_value / EnchantmentItem.Reblath_Duo.total_amount / 1000000, 2));
        const targetAmount = this.controller.getTargetAmount().value();
        let fsPrice = 0;
        let text = '';
        for (let i = 1; i < this.failstacks.size; i++) {
            const fs = this.failstacks.get(i);
            if (fs && fs.amount > 0) {
                const fsAmountPerTarget = nf(fs.amount / targetAmount, 2);
                const fsPricePer = nf(fs.value / fs.amount / 1000000, 2);
                text += ' fs:' + fs.tier + ' ' + fsAmountPerTarget + 'x each(' + fsPricePer + 'm) // ';
                fsPrice += fs.value;
            }
        }
        const clicksPerTarget = nf(this.clicks / targetAmount, 2);
        const pricePerTarget = nf(this.price / 1000000 / targetAmount, 2);
        const reblathPrice = EnchantmentItem.Reblath_Duo.value + EnchantmentItem.Reblath_Tri.value + EnchantmentItem.Reblath_Tet.value + EnchantmentItem.Reblath_Pen.value;
        const totalPricePerTarget = nf((fsPrice + reblathPrice) / 1000000 / targetAmount, 2);
        this.controller.getStacksCrafted().value(`cpt: ${clicksPerTarget} | ppt: ${pricePerTarget} | tppt: ${totalPricePerTarget} - ` + text);
    }
    takeFs(x) {
        logger.debug('takeFs', x);
        const targetFS = this.failstacks.get(x);
        logger.debug('targetFS-b', targetFS);
        this.currentFailstack.tier = x;
        this.currentFailstack.value = targetFS.value / targetFS.amount;
        targetFS.value -= this.currentFailstack.value;
        this.currentFailstack.amount = 1;
        targetFS.amount -= 1;
        logger.debug('targetFS-a', targetFS);
    }
    insertFs() {
        logger.debug('insertFs', this.currentFailstack);
        const targetFs = this.failstacks.get(this.currentFailstack.tier);
        targetFs.amount++;
        targetFs.value += this.currentFailstack.value;
    }
    increaseFs(esItem) {
        logger.debug('increaseFs', this.currentFailstack, esItem);
        this.currentFailstack.tier = this.currentFailstack.tier + esItem.failstack_increase;
        switch (esItem) {
            case EnchantmentItem.Reblath_Tet:
                this.currentFailstack.value = this.currentFailstack.value + CONCENTRATED + EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
                EnchantmentItem.Reblath_Tet.value = EnchantmentItem.Reblath_Tet.value - EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
                break;
            case EnchantmentItem.Reblath_Tri:
                this.currentFailstack.value = this.currentFailstack.value + CONCENTRATED + EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
                EnchantmentItem.Reblath_Tri.value = EnchantmentItem.Reblath_Tri.value - EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
                break;
            case EnchantmentItem.Reblath_Duo:
                this.currentFailstack.value = this.currentFailstack.value + CONCENTRATED + EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
                EnchantmentItem.Reblath_Duo.value = EnchantmentItem.Reblath_Duo.value - EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
                break;
            case EnchantmentItem.Reblath_Mon:
                this.currentFailstack.value = this.currentFailstack.value + CONCENTRATED;
                break;
            case EnchantmentItem.Blackstar_Tet:
                this.currentFailstack.value =
                    this.currentFailstack.value + FLAWLESSMAGICALBLACKSTONE + 20 * MEMORYFRAGMENT + EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
                EnchantmentItem.Blackstar_Tet.value = EnchantmentItem.Blackstar_Tet.value - EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
                break;
            case EnchantmentItem.Blackstar_Tri:
                this.currentFailstack.value =
                    this.currentFailstack.value + FLAWLESSMAGICALBLACKSTONE + 20 * MEMORYFRAGMENT + EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
                EnchantmentItem.Blackstar_Tri.value = EnchantmentItem.Blackstar_Tri.value - EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
                break;
            case EnchantmentItem.Blackstar_Duo:
                this.currentFailstack.value =
                    this.currentFailstack.value + FLAWLESSMAGICALBLACKSTONE + 20 * MEMORYFRAGMENT + EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
                EnchantmentItem.Blackstar_Duo.value = EnchantmentItem.Blackstar_Duo.value - EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
                break;
            case EnchantmentItem.Blackstar_Mon:
                this.currentFailstack.value = this.currentFailstack.value + FLAWLESSMAGICALBLACKSTONE + 20 * MEMORYFRAGMENT;
                break;
        }
    }
    deleteFs() {
        logger.debug('deleteFs', this.currentFailstack);
        this.currentFailstack.tier = 0;
        this.currentFailstack.amount = 0;
        this.currentFailstack.value = 0;
    }
    increaseItem(esItem, pitySuccess = false) {
        logger.debug('itemIncrease', this.currentFailstack, esItem);
        switch (esItem) {
            case EnchantmentItem.Reblath_Tet:
                EnchantmentItem.Reblath_Pen.value += CONCENTRATED;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Pen.value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Pen.value += EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
                EnchantmentItem.Reblath_Tet.value -= EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
                EnchantmentItem.Reblath_Pen.amount++;
                EnchantmentItem.Reblath_Tet.amount--;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Pen.total_value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Pen.total_value += CONCENTRATED + EnchantmentItem.Reblath_Tet.total_value / EnchantmentItem.Reblath_Tet.total_amount;
                EnchantmentItem.Reblath_Pen.total_amount++;
                break;
            case EnchantmentItem.Reblath_Tri:
                EnchantmentItem.Reblath_Tet.value += CONCENTRATED;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Tet.value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Tet.value += EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
                EnchantmentItem.Reblath_Tri.value -= EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
                EnchantmentItem.Reblath_Tet.amount++;
                EnchantmentItem.Reblath_Tri.amount--;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Tet.total_value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Tet.total_value += CONCENTRATED + EnchantmentItem.Reblath_Tri.total_value / EnchantmentItem.Reblath_Tri.total_amount;
                EnchantmentItem.Reblath_Tet.total_amount++;
                break;
            case EnchantmentItem.Reblath_Duo:
                EnchantmentItem.Reblath_Tri.value += CONCENTRATED;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Tri.value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Tri.value += EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
                EnchantmentItem.Reblath_Duo.value -= EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
                EnchantmentItem.Reblath_Tri.amount++;
                EnchantmentItem.Reblath_Duo.amount--;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Tri.total_value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Tri.total_value += CONCENTRATED + EnchantmentItem.Reblath_Duo.total_value / EnchantmentItem.Reblath_Duo.total_amount;
                EnchantmentItem.Reblath_Tri.total_amount++;
                break;
            case EnchantmentItem.Reblath_Mon:
                EnchantmentItem.Reblath_Duo.value += CONCENTRATED;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Duo.value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Duo.amount++;
                EnchantmentItem.Reblath_Mon.amount--;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Duo.total_value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Duo.total_value += CONCENTRATED;
                EnchantmentItem.Reblath_Duo.total_amount++;
                break;
            case EnchantmentItem.Blackstar_Tet:
                EnchantmentItem.Blackstar_Pen.value += FLAWLESSMAGICALBLACKSTONE;
                if (!pitySuccess)
                    EnchantmentItem.Blackstar_Pen.value += this.currentFailstack.value;
                EnchantmentItem.Blackstar_Pen.value += EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
                EnchantmentItem.Blackstar_Tet.value -= EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
                EnchantmentItem.Blackstar_Pen.amount++;
                EnchantmentItem.Blackstar_Tet.amount--;
                break;
            case EnchantmentItem.Blackstar_Tri:
                EnchantmentItem.Blackstar_Tet.value += FLAWLESSMAGICALBLACKSTONE;
                if (!pitySuccess)
                    EnchantmentItem.Blackstar_Tet.value += this.currentFailstack.value;
                EnchantmentItem.Blackstar_Tet.value += EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
                EnchantmentItem.Blackstar_Tri.value -= EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
                EnchantmentItem.Blackstar_Tet.amount++;
                EnchantmentItem.Blackstar_Tri.amount--;
                break;
            case EnchantmentItem.Blackstar_Duo:
                EnchantmentItem.Blackstar_Tri.value += FLAWLESSMAGICALBLACKSTONE;
                if (!pitySuccess)
                    EnchantmentItem.Blackstar_Tri.value += this.currentFailstack.value;
                EnchantmentItem.Blackstar_Tri.value += EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
                EnchantmentItem.Blackstar_Duo.value -= EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
                EnchantmentItem.Blackstar_Tri.amount++;
                EnchantmentItem.Blackstar_Duo.amount--;
                break;
            case EnchantmentItem.Blackstar_Mon:
                EnchantmentItem.Blackstar_Duo.value += FLAWLESSMAGICALBLACKSTONE;
                if (!pitySuccess)
                    EnchantmentItem.Blackstar_Duo.value += this.currentFailstack.value;
                EnchantmentItem.Blackstar_Duo.amount++;
                EnchantmentItem.Blackstar_Mon.amount--;
                break;
        }
    }
    decreaseItem(esItem) {
        logger.debug('itemDecrease', this.currentFailstack, esItem);
        switch (esItem) {
            case EnchantmentItem.Reblath_Tet:
                EnchantmentItem.Reblath_Tri.amount++;
                EnchantmentItem.Reblath_Tet.amount--;
                EnchantmentItem.Reblath_Tri.total_amount++;
                break;
            case EnchantmentItem.Reblath_Tri:
                EnchantmentItem.Reblath_Duo.amount++;
                EnchantmentItem.Reblath_Tri.amount--;
                EnchantmentItem.Reblath_Duo.total_amount++;
                break;
            case EnchantmentItem.Reblath_Duo:
                EnchantmentItem.Reblath_Mon.amount++;
                EnchantmentItem.Reblath_Duo.amount--;
                EnchantmentItem.Reblath_Mon.total_amount++;
                break;
            case EnchantmentItem.Blackstar_Tet:
                EnchantmentItem.Blackstar_Tri.amount++;
                EnchantmentItem.Blackstar_Tet.amount--;
                break;
            case EnchantmentItem.Blackstar_Tri:
                EnchantmentItem.Blackstar_Duo.amount++;
                EnchantmentItem.Blackstar_Tri.amount--;
                break;
            case EnchantmentItem.Blackstar_Duo:
                EnchantmentItem.Blackstar_Mon.amount++;
                EnchantmentItem.Blackstar_Duo.amount--;
                break;
        }
        logger.debug(EnchantmentItem.Reblath_Mon, EnchantmentItem.Reblath_Duo, EnchantmentItem.Reblath_Tri);
    }
    upgrade(esItem) {
        logger.debug('upgrade', this.currentFailstack, esItem);
        this.price += CONCENTRATED;
        const pity = esItem.pity;
        const applyPity = pity.check();
        let message;
        if (applyPity) {
            message = `${esItem.name} successful because pity got applied`;
            this.increaseItem(esItem, true);
            this.insertFs();
            pity.reset();
        }
        else {
            const roll = Math.random() * 100;
            const uppBaseChance = esItem.base_chance;
            const uppFS = this.currentFailstack.tier + this.controller.getFamilyFS().value();
            const uppChance = uppBaseChance + (uppFS * uppBaseChance) / 10;
            if (roll < uppChance) {
                message = `${esItem.name} successful with ${this.currentFailstack.tier} because ${nf(roll, 2)} < ${nf(uppChance, 2)}`;
                this.increaseItem(esItem);
                this.deleteFs();
                pity.reset();
            }
            else {
                message = `${esItem.name} failed with ${this.currentFailstack.tier} because ${nf(roll, 2)} > ${nf(uppChance, 2)} ${pity.current}/${pity.max} pity stacks`;
                this.increaseFs(esItem);
                this.decreaseItem(esItem);
                this.insertFs();
                this.deleteFs();
                pity.increase();
            }
        }
        this.controller.getLastClick().value(message);
        const endFS = this.controller.getEnchantmentStep(this.controller.getEnchantmentStepsSize() - 1).endFS.value() - this.controller.getFamilyFS().value();
        const targetFs = this.controller.getTargetAmount().value();
        if (this.failstacks.get(endFS).amount == targetFs) {
            this.upgrading = false;
        }
    }
    Enchantment() {
        this.clicks += 1;
        logger.debug('Enchantment', this.controller.getEnchantmentStepsSize(), this.currentFailstack);
        let esItem;
        for (let es_index = this.controller.getEnchantmentStepsSize() - 1; es_index >= 0; es_index--) {
            logger.debug('Enchantment Step', es_index);
            let fsFound = false;
            const enchantmentStep = this.controller.getEnchantmentStep(es_index);
            esItem = enchantmentStep.item.value();
            const esStartFS = enchantmentStep.startFS.value() - this.controller.getFamilyFS().value();
            const esEndFS = enchantmentStep.endFS.value() - this.controller.getFamilyFS().value();
            if ((esItem == EnchantmentItem.Reblath_Tet && EnchantmentItem.Reblath_Tet.amount > 0) ||
                (esItem == EnchantmentItem.Reblath_Tri && EnchantmentItem.Reblath_Tri.amount > 0) ||
                (esItem == EnchantmentItem.Blackstar_Tet && EnchantmentItem.Blackstar_Tet.amount > 0) ||
                (esItem == EnchantmentItem.Blackstar_Tri && EnchantmentItem.Blackstar_Tri.amount > 0) ||
                (esItem == EnchantmentItem.Blackstar_Duo && EnchantmentItem.Blackstar_Duo.amount > 0)) {
                for (let j = esEndFS - 1; j >= esStartFS; j--) {
                    if (this.failstacks.get(j).amount > 0) {
                        this.takeFs(j);
                        fsFound = true;
                        break;
                    }
                }
            }
            else if (esItem == EnchantmentItem.Reblath_Duo && EnchantmentItem.Reblath_Duo.amount > 0) {
                for (let j = esEndFS - 1; j >= esStartFS; j--) {
                    if (j == esStartFS && this.failstacks.get(j).amount == 0 && esStartFS <= 30) {
                        this.failstacks.get(30).amount++;
                        this.failstacks.get(30).value += BUY_FS_30;
                        this.price += BUY_FS_30;
                        j = 30;
                    }
                    if (j >= esStartFS && this.failstacks.get(j).amount > 0) {
                        this.takeFs(j);
                        fsFound = true;
                        break;
                    }
                }
            }
            else if ((esItem == EnchantmentItem.Reblath_Mon && EnchantmentItem.Reblath_Mon.amount > 0) ||
                (esItem == EnchantmentItem.Blackstar_Mon && EnchantmentItem.Blackstar_Mon.amount > 0)) {
                console.warn('looking for mon click', enchantmentStep);
                for (let j = esEndFS - 1; j >= esStartFS; j--) {
                    if (j == esStartFS && this.failstacks.get(j).amount == 0) {
                        if (esStartFS == 5) {
                            this.failstacks.get(5).amount++;
                            this.failstacks.get(5).value += BUY_FS_5;
                            this.price += BUY_FS_5;
                        }
                        if (esStartFS == 10) {
                            this.failstacks.get(10).amount++;
                            this.failstacks.get(10).value += BUY_FS_10;
                            this.price += BUY_FS_10;
                        }
                        if (esStartFS == 15) {
                            this.failstacks.get(15).amount++;
                            this.failstacks.get(15).value += BUY_FS_15;
                            this.price += BUY_FS_15;
                        }
                        if (esStartFS == 20) {
                            this.failstacks.get(20).amount++;
                            this.failstacks.get(20).value += BUY_FS_20;
                            this.price += BUY_FS_20;
                        }
                        if (esStartFS == 25) {
                            this.failstacks.get(25).amount++;
                            this.failstacks.get(25).value += BUY_FS_25;
                            this.price += BUY_FS_25;
                        }
                        if (esStartFS == 30) {
                            this.failstacks.get(30).amount++;
                            this.failstacks.get(30).value += BUY_FS_30;
                            this.price += BUY_FS_30;
                        }
                    }
                    if (j >= esStartFS && this.failstacks.get(j).amount > 0) {
                        this.takeFs(j);
                        fsFound = true;
                        break;
                    }
                }
            }
            else if (esItem == EnchantmentItem.Reblath_Mon && EnchantmentItem.Reblath_Mon.amount == 0) {
                this.controller.getLastClick().value('keine mons');
                this.upgrading = false;
                fsFound = true;
            }
            if (fsFound)
                break;
        }
        if (this.currentFailstack.amount > 0 && esItem) {
            logger.debug('found', this.currentFailstack);
            this.upgrade(esItem);
        }
        else
            logger.debug('not found');
    }
    enchantmentItem_Pity_Current_OnChange(reblathIndex, newPityCurrent) {
        const reblath = this.controller.getEnchantmentItem(reblathIndex);
        if (!reblath)
            return logger.warn(`There are no ${reblathIndex + 1} Reblaths`);
        logger.debug(`The Current Pity Stack of Reblath(${reblathIndex}) has changed(${reblath.amount.value()} => ${newPityCurrent})`);
    }
    enchantmentItem_Pity_Max_OnChange(reblathIndex, newPityMax) {
        const reblath = this.controller.getEnchantmentItem(reblathIndex);
        if (!reblath)
            return logger.warn(`There are no ${reblathIndex + 1} Reblaths`);
        logger.debug(`The Max Pity Stack of Reblath(${reblathIndex}) has changed(${reblath.amount.value()} => ${newPityMax})`);
    }
    enchantmentItem_Amount_OnChange(reblathIndex, newReblathAmount) {
        const reblath = this.controller.getEnchantmentItem(reblathIndex);
        if (!reblath)
            return logger.warn(`There are no ${reblathIndex + 1} Reblaths`);
        logger.debug(`The Amount of Reblath(${reblathIndex}) has changed(${reblath.amount.value()} => ${newReblathAmount})`);
    }
    enchantmentItem_WorthEach_OnChange(reblathIndex, newReblathWorthEach) {
        const reblath = this.controller.getEnchantmentItem(reblathIndex);
        if (!reblath)
            return logger.warn(`There are no ${reblathIndex + 1} Reblaths`);
        logger.debug(`The Worth of each Reblath(${reblathIndex}) has changed(${reblath.worthEach.value()} => ${newReblathWorthEach})`);
    }
    addReblath_OnClick() {
        logger.debug('Add new Reblath');
        this.addItem('Reblath');
        this.refresh();
    }
    addBlackStar_OnClick() {
        logger.debug('Add new Blackstar');
        this.addItem('Blackstar');
        this.refresh();
    }
    familyFS_OnChange(newFamilyFS) {
        logger.debug(`The Family FS has changed(${this.controller.getFamilyFS().value()} => ${newFamilyFS})`);
        const step = this.controller.getEnchantmentStep(0);
        if (!step)
            return logger.warn('There are no Enchantment Steps');
        step.startFS.value(newFamilyFS + this.controller.getBuyFS().value());
    }
    buyFS_OnChange(newBuyFS) {
        logger.debug(`The Buy FS has changed(${this.controller.getBuyFS().value()} => ${newBuyFS})`);
        const step = this.controller.getEnchantmentStep(0);
        if (!step)
            return logger.warn('There are no Enchantment Steps');
        step.startFS.value(this.controller.getFamilyFS().value() + newBuyFS);
    }
    targetAmount_OnChange(newTargetAmount) {
        logger.debug(`The Target Amount has changed(${this.controller.getTargetAmount().value()} => ${newTargetAmount})`);
    }
    enchantmentStep_Item_OnChange(stepIndex, newItem) {
        const step = this.controller.getEnchantmentStep(stepIndex);
        if (!step)
            return logger.warn(`There are no ${stepIndex + 1} Steps`);
        logger.debug(`The Item of Step(${stepIndex}) has changed(${step.item.value().name} => ${newItem.name})`);
        const startFS = step.startFS.value();
        const clicks = step.clicks.value();
        const endFS = startFS + newItem.failstack_increase * clicks;
        step.endFS.value(endFS);
    }
    enchantmentStep_StartFS_OnChange(stepIndex, newStartFS) {
        const step = this.controller.getEnchantmentStep(stepIndex);
        if (!step)
            return logger.warn(`There are no ${stepIndex + 1} Steps`);
        logger.debug(`The Start FS of Step(${stepIndex}) has changed(${step.startFS.value()} => ${newStartFS})`);
        const inc_per_clicks = step.item.value().failstack_increase;
        const clicks = step.clicks.value();
        const endFS = newStartFS + inc_per_clicks * clicks;
        step.endFS.value(endFS);
    }
    enchantmentStep_EndFS_OnChange(stepIndex, newEndFS) {
        const step = this.controller.getEnchantmentStep(stepIndex);
        if (!step)
            return logger.warn(`There are no ${stepIndex + 1} Steps`);
        logger.debug(`The End FS of Step(${stepIndex}) has changed(${step.endFS.value()} => ${newEndFS})`);
        const nextIndex = stepIndex + 1;
        if (nextIndex >= this.controller.getEnchantmentStepsSize())
            return;
        const step_next = this.controller.getEnchantmentStep(nextIndex);
        if (!step_next)
            return logger.warn(`There are no ${nextIndex + 1} Steps`);
        step_next.startFS.value(newEndFS);
    }
    enchantmentStep_Clicks_OnChange(stepIndex, newClicks) {
        const step = this.controller.getEnchantmentStep(stepIndex);
        if (!step)
            return logger.warn(`There are no ${stepIndex + 1} Steps`);
        logger.debug(`The Clicks of Step(${stepIndex}) has changed(${step.clicks.value()} => ${newClicks})`);
        const startFS = step.startFS.value();
        const inc_per_clicks = step.item.value().failstack_increase;
        const endFS = startFS + inc_per_clicks * newClicks;
        step.endFS.value(endFS);
    }
    singleClick_OnClick() {
        logger.debug('Single Click');
        this.Enchantment();
        this.refresh();
    }
    clicksPerIteration_OnChange(newClicksPerIteration) {
        logger.debug(`The Clicks per Iterations has changed(${this.controller.getClicksPerIteration().value()} => ${newClicksPerIteration})`);
    }
    iterationsPerSecond_OnChange(newIterationsPerSecond) {
        logger.debug(`The Iterations per Second has changed(${this.controller.getIterationsPerSecond().value()} => ${newIterationsPerSecond})`);
    }
    async upgradeStartOnClick() {
        logger.debug('Upgrade Start');
        this.upgrading = true;
        let iteration = 0;
        while (this.upgrading) {
            logger.debug('Iteration: ' + iteration);
            for (let click = 0; this.upgrading && click < this.controller.getClicksPerIteration().value(); click++) {
                this.Enchantment();
            }
            this.refresh();
            const delay = 1000 / this.controller.getIterationsPerSecond().value();
            logger.debug('delay: ' + delay);
            await new Promise(r => setTimeout(r, delay));
            iteration++;
        }
    }
    upgradeStop_OnClick() {
        logger.debug('Upgrade Stop');
        this.upgrading = false;
    }
    lastClick_OnChange(newLastClick) {
        logger.debug(`The Last Click has changed(${this.controller.getLastClick().value()} => ${newLastClick})`);
    }
    stacksCrafted_OnChange(newStacksCrafted) {
        logger.debug(`The Stacks Crafted has changed(${this.controller.getStacksCrafted().value()} => ${newStacksCrafted})`);
    }
}
