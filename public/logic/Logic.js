import Logger from '../util/Logger.js';
import { TEST_RNG } from '../util/TestRng.js';
import { nf, nf_commas, nf_fixed } from '../util/util.js';
import { Evaluation } from '../view/View.js';
import EnchantmentItem from './EnchantmentItem.js';
import EnchantmentMaterial, { EnchantmentMaterialShadowed } from './EnchantmentMaterial.js';
import { FailStack } from './FailStack.js';
export default class Logic {
    constructor() {
        this.initialized = false;
        this.currentFailstack = {
            tier: 0,
            value: 0,
            amount: 0
        };
        this.failstacks = new Map();
        this.rand = new TEST_RNG(0);
        this.upgrading = false;
        this.clicks = 0;
        for (let i = 1; i <= 500; i++)
            this.failstacks.set(i, new FailStack(i));
    }
    link(controller) {
        this.controller = controller;
    }
    init() {
        this.setupDemo();
        this.initialized = true;
        this.refresh();
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
        this.controller.getClicksPerIteration().value(1);
        this.controller.getIterationsPerSecond().value(1000);
        for (let n = 0; n < 10; n++)
            this.addItem('Reblath');
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
    }
    addItem(item) {
        Logger.debug('addItem', item);
        switch (item) {
            case 'Reblath':
                EnchantmentItem.Reblath_Mon.amount = EnchantmentItem.Reblath_Mon.amount + 10;
                break;
            case 'Blackstar':
                EnchantmentItem.Blackstar_Mon.amount++;
                EnchantmentItem.Blackstar_Mon.value += EnchantmentMaterial.BLACKSTAR_MON.use();
                break;
        }
    }
    refresh() {
        Logger.debug('refresh', this.initialized);
        if (!this.initialized)
            return;
        const monReblathText = this.controller.getEnchantmentItem(0);
        const duoReblathText = this.controller.getEnchantmentItem(1);
        const triReblathText = this.controller.getEnchantmentItem(2);
        const tetReblathText = this.controller.getEnchantmentItem(3);
        const penReblathText = this.controller.getEnchantmentItem(4);
        const monReblathPity = this.controller.getEnchantmentItem(0).pity;
        monReblathPity.current.set(EnchantmentItem.Reblath_Mon.pity.current);
        monReblathPity.max.set(EnchantmentItem.Reblath_Mon.pity.max);
        const duoReblathPity = this.controller.getEnchantmentItem(1).pity;
        duoReblathPity.current.set(EnchantmentItem.Reblath_Duo.pity.current);
        duoReblathPity.max.set(EnchantmentItem.Reblath_Duo.pity.max);
        const triReblathPity = this.controller.getEnchantmentItem(2).pity;
        triReblathPity.current.set(EnchantmentItem.Reblath_Tri.pity.current);
        triReblathPity.max.set(EnchantmentItem.Reblath_Tri.pity.max);
        const tetReblathPity = this.controller.getEnchantmentItem(3).pity;
        tetReblathPity.current.set(EnchantmentItem.Reblath_Tet.pity.current);
        tetReblathPity.max.set(EnchantmentItem.Reblath_Tet.pity.max);
        monReblathText.amount.value(EnchantmentItem.Reblath_Mon.amount);
        duoReblathText.amount.value(EnchantmentItem.Reblath_Duo.amount);
        triReblathText.amount.value(EnchantmentItem.Reblath_Tri.amount);
        tetReblathText.amount.value(EnchantmentItem.Reblath_Tet.amount);
        penReblathText.amount.value(EnchantmentItem.Reblath_Pen.amount);
        if (EnchantmentItem.Reblath_Duo.total_value)
            duoReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Duo.total_value / EnchantmentItem.Reblath_Duo.total_amount / 1000000, 3));
        if (EnchantmentItem.Reblath_Tri.total_value)
            triReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Tri.total_value / EnchantmentItem.Reblath_Tri.total_amount / 1000000, 3));
        if (EnchantmentItem.Reblath_Tet.total_value)
            tetReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Tet.total_value / EnchantmentItem.Reblath_Tet.total_amount / 1000000, 3));
        if (EnchantmentItem.Reblath_Pen.total_value)
            penReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Pen.total_value / EnchantmentItem.Reblath_Pen.total_amount / 1000000, 3));
        const scaleOutput = this.controller.getScaleOutput().value();
        const scalarr = this.controller.getTargetAmount().value();
        let text = '';
        for (let i = 1; i < this.failstacks.size; i++) {
            const fs = this.failstacks.get(i);
            if (fs.amount > 0) {
                const fsAmountPerTarget = scaleOutput ? nf_commas(fs.amount / scalarr, 2) : nf_commas(fs.amount);
                const fsValuePer = nf_commas(fs.value / fs.amount / 1000000, 3);
                text += ' fs:' + fs.tier + ' ' + fsAmountPerTarget + 'x each(' + fsValuePer + 'm) // ';
            }
        }
        const clicks = nf_commas(this.clicks);
        const costs = scaleOutput ? nf_commas(EnchantmentMaterial.total_cost() / 1000000 / scalarr, 3) : nf_commas(EnchantmentMaterial.total_cost() / 1000000);
        this.controller.getStacksCrafted().set(`clicks: ${clicks} | costs: ${costs} m | ` + text);
        const failstacks = Array.from(this.failstacks)
            .filter(fs => fs[1].amount > 0)
            .map(fs => fs[1]);
        const evaluation = new Evaluation(failstacks, this.findFS75Value());
        this.controller.getEvaluation().set(evaluation);
        this.controller.getFailstacks().set(Array.from(this.failstacks)
            .filter(fs => fs[1].total_amount > 0)
            .map(fs => fs[1]));
        const endFS_min = this.controller.getEnchantmentStep(this.controller.getEnchantmentStepsSize() - 1).endFS.value() - this.controller.getFamilyFS().value();
        let currentTargetFS = 0;
        for (let i = endFS_min; i < this.failstacks.size; i++) {
            const fs = this.failstacks.get(i);
            if (fs.amount)
                currentTargetFS += fs.amount;
        }
        this.controller.getCurrentTargetFS().set({ current: currentTargetFS, max: this.controller.getTargetAmount().value() });
    }
    findFS75Value() {
        const fs75 = this.failstacks.get(75);
        if (fs75.total_amount > 10)
            return fs75.total_value / fs75.total_amount;
        let total_value = 0;
        let total_amount = 0;
        for (let index = 70; index < 80; index++) {
            const fs = this.failstacks.get(index);
            if (fs.total_amount < 1)
                continue;
            total_amount++;
            total_value += fs.total_value / fs.total_amount;
        }
        if (total_amount > 0)
            total_value /= total_amount;
        return total_value;
    }
    takeFs(x) {
        Logger.debug('takeFs', x);
        const matchingFS = this.failstacks.get(x);
        Logger.debug('targetFS-b', matchingFS);
        this.currentFailstack.tier = x;
        this.currentFailstack.value = matchingFS.value / matchingFS.amount;
        matchingFS.value -= matchingFS.value / matchingFS.amount;
        this.currentFailstack.amount = 1;
        matchingFS.amount -= 1;
        Logger.debug('targetFS-a', matchingFS);
    }
    insertFs(pitySuccess) {
        Logger.debug('insertFs', this.currentFailstack);
        const matchingFS = this.failstacks.get(this.currentFailstack.tier);
        matchingFS.amount++;
        matchingFS.value += this.currentFailstack.value;
        if (!pitySuccess) {
            matchingFS.total_amount++;
            matchingFS.total_value += this.currentFailstack.value;
        }
    }
    increaseFs(esItem) {
        Logger.debug('increaseFs', this.currentFailstack, esItem);
        this.currentFailstack.tier += esItem.failstack_increase;
        switch (esItem) {
            case EnchantmentItem.Reblath_Tet:
                this.currentFailstack.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
                this.currentFailstack.value += EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
                EnchantmentItem.Reblath_Tet.value -= EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
                break;
            case EnchantmentItem.Reblath_Tri:
                this.currentFailstack.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
                this.currentFailstack.value += EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
                EnchantmentItem.Reblath_Tri.value -= EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
                break;
            case EnchantmentItem.Reblath_Duo:
                this.currentFailstack.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
                this.currentFailstack.value += EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
                EnchantmentItem.Reblath_Duo.value -= EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
                break;
            case EnchantmentItem.Reblath_Mon:
                this.currentFailstack.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
                break;
            case EnchantmentItem.Blackstar_Tet:
                this.currentFailstack.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use() + EnchantmentMaterial.MEMORY_FRAGMENT.use(20);
                this.currentFailstack.value += EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
                EnchantmentItem.Blackstar_Tet.value -= EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
                break;
            case EnchantmentItem.Blackstar_Tri:
                this.currentFailstack.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use() + EnchantmentMaterial.MEMORY_FRAGMENT.use(20);
                this.currentFailstack.value += EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
                EnchantmentItem.Blackstar_Tri.value -= EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
                break;
            case EnchantmentItem.Blackstar_Duo:
                this.currentFailstack.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use() + EnchantmentMaterial.MEMORY_FRAGMENT.use(20);
                this.currentFailstack.value += EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
                EnchantmentItem.Blackstar_Duo.value -= EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
                break;
            case EnchantmentItem.Blackstar_Mon:
                this.currentFailstack.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use() + EnchantmentMaterial.MEMORY_FRAGMENT.use(20);
                break;
        }
    }
    resetFS() {
        Logger.debug('resetFS', this.currentFailstack);
        this.currentFailstack.tier = 0;
        this.currentFailstack.amount = 0;
        this.currentFailstack.value = 0;
    }
    increaseItem(esItem, pitySuccess) {
        Logger.debug('increaseItem', this.currentFailstack, esItem);
        switch (esItem) {
            case EnchantmentItem.Reblath_Tet:
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Pen.value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Pen.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
                EnchantmentItem.Reblath_Pen.value += EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
                EnchantmentItem.Reblath_Tet.value -= EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
                EnchantmentItem.Reblath_Pen.amount++;
                EnchantmentItem.Reblath_Tet.amount--;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Pen.total_value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Pen.total_value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.price;
                EnchantmentItem.Reblath_Pen.total_value += EnchantmentItem.Reblath_Tet.total_value / EnchantmentItem.Reblath_Tet.total_amount;
                EnchantmentItem.Reblath_Pen.total_amount++;
                break;
            case EnchantmentItem.Reblath_Tri:
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Tet.value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Tet.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
                EnchantmentItem.Reblath_Tet.value += EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
                EnchantmentItem.Reblath_Tri.value -= EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
                EnchantmentItem.Reblath_Tet.amount++;
                EnchantmentItem.Reblath_Tri.amount--;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Tet.total_value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Tet.total_value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.price;
                EnchantmentItem.Reblath_Tet.total_value += EnchantmentItem.Reblath_Tri.total_value / EnchantmentItem.Reblath_Tri.total_amount;
                EnchantmentItem.Reblath_Tet.total_amount++;
                break;
            case EnchantmentItem.Reblath_Duo:
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Tri.value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Tri.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
                EnchantmentItem.Reblath_Tri.value += EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
                EnchantmentItem.Reblath_Duo.value -= EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
                EnchantmentItem.Reblath_Tri.amount++;
                EnchantmentItem.Reblath_Duo.amount--;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Tri.total_value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Tri.total_value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.price;
                EnchantmentItem.Reblath_Tri.total_value += EnchantmentItem.Reblath_Duo.total_value / EnchantmentItem.Reblath_Duo.total_amount;
                EnchantmentItem.Reblath_Tri.total_amount++;
                break;
            case EnchantmentItem.Reblath_Mon:
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Duo.value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Duo.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
                EnchantmentItem.Reblath_Duo.amount++;
                EnchantmentItem.Reblath_Mon.amount--;
                if (!pitySuccess)
                    EnchantmentItem.Reblath_Duo.total_value += this.currentFailstack.value;
                EnchantmentItem.Reblath_Duo.total_value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.price;
                EnchantmentItem.Reblath_Duo.total_amount++;
                break;
            case EnchantmentItem.Blackstar_Tet:
                EnchantmentItem.Blackstar_Pen.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use();
                if (!pitySuccess)
                    EnchantmentItem.Blackstar_Pen.value += this.currentFailstack.value;
                EnchantmentItem.Blackstar_Pen.value += EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
                EnchantmentItem.Blackstar_Tet.value -= EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
                EnchantmentItem.Blackstar_Pen.amount++;
                EnchantmentItem.Blackstar_Tet.amount--;
                break;
            case EnchantmentItem.Blackstar_Tri:
                EnchantmentItem.Blackstar_Tet.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use();
                if (!pitySuccess)
                    EnchantmentItem.Blackstar_Tet.value += this.currentFailstack.value;
                EnchantmentItem.Blackstar_Tet.value += EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
                EnchantmentItem.Blackstar_Tri.value -= EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
                EnchantmentItem.Blackstar_Tet.amount++;
                EnchantmentItem.Blackstar_Tri.amount--;
                break;
            case EnchantmentItem.Blackstar_Duo:
                EnchantmentItem.Blackstar_Tri.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use();
                if (!pitySuccess)
                    EnchantmentItem.Blackstar_Tri.value += this.currentFailstack.value;
                EnchantmentItem.Blackstar_Tri.value += EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
                EnchantmentItem.Blackstar_Duo.value -= EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
                EnchantmentItem.Blackstar_Tri.amount++;
                EnchantmentItem.Blackstar_Duo.amount--;
                break;
            case EnchantmentItem.Blackstar_Mon:
                EnchantmentItem.Blackstar_Duo.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use();
                if (!pitySuccess)
                    EnchantmentItem.Blackstar_Duo.value += this.currentFailstack.value;
                EnchantmentItem.Blackstar_Duo.amount++;
                EnchantmentItem.Blackstar_Mon.amount--;
                break;
        }
    }
    decreaseItem(esItem) {
        Logger.debug('itemDecrease', this.currentFailstack, esItem);
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
        Logger.debug(EnchantmentItem.Reblath_Mon, EnchantmentItem.Reblath_Duo, EnchantmentItem.Reblath_Tri);
    }
    upgrade(esItem) {
        Logger.debug('upgrade', this.currentFailstack, esItem);
        const pity = esItem.pity;
        const applyPity = pity.check();
        let message = `${esItem.name}: `;
        if (applyPity) {
            message += `Succeeded`;
            message += `, because Pity-Stack got applied`;
            this.increaseItem(esItem, true);
            this.insertFs(true);
            this.resetFS();
            pity.reset();
        }
        else {
            const roll = Math.random() * 100;
            const uppBaseChance = esItem.base_chance;
            const uppFS = this.currentFailstack.tier + this.controller.getFamilyFS().value();
            const uppChance = uppBaseChance + (uppFS * uppBaseChance) / 10;
            if (roll < uppChance) {
                message += `Succeeded with a Failstack of ${this.currentFailstack.tier}`;
                message += `, because ${nf_fixed(roll, 2)} < ${nf_fixed(uppChance, 2)}`;
                this.increaseItem(esItem, false);
                this.resetFS();
                pity.reset();
            }
            else {
                message += `Failed with a Failstack of ${this.currentFailstack.tier}`;
                message += `, because ${nf_fixed(roll, 2)} > ${nf_fixed(uppChance, 2)}`;
                this.increaseFs(esItem);
                this.decreaseItem(esItem);
                this.insertFs(false);
                this.resetFS();
                pity.increase();
            }
        }
        this.controller.getLastClick().set(message);
        const endFS_min = this.controller.getEnchantmentStep(this.controller.getEnchantmentStepsSize() - 1).endFS.value() - this.controller.getFamilyFS().value();
        const targetAmount = this.controller.getTargetAmount().value();
        let currentTargetFS = 0;
        for (let i = endFS_min; i < this.failstacks.size; i++) {
            const fs = this.failstacks.get(i);
            if (fs.amount)
                currentTargetFS += fs.amount;
        }
        if (currentTargetFS >= targetAmount)
            this.upgrading = false;
    }
    Enchantment() {
        this.clicks += 1;
        Logger.debug('Enchantment', this.controller.getEnchantmentStepsSize(), this.currentFailstack);
        let esItem;
        for (let es_index = this.controller.getEnchantmentStepsSize() - 1; es_index >= 0; es_index--) {
            Logger.debug('Enchantment Step', es_index);
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
                        this.failstacks.get(30).value += EnchantmentMaterialShadowed.BUY_FS_30.use();
                        this.failstacks.get(30).total_amount++;
                        this.failstacks.get(30).total_value += EnchantmentMaterialShadowed.BUY_FS_30.price;
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
                for (let j = esEndFS - 1; j >= esStartFS; j--) {
                    if (j == esStartFS && this.failstacks.get(j).amount == 0) {
                        if (esStartFS == 5) {
                            this.failstacks.get(5).amount++;
                            this.failstacks.get(5).value += EnchantmentMaterialShadowed.BUY_FS_5.use();
                            this.failstacks.get(5).total_amount++;
                            this.failstacks.get(5).total_value += EnchantmentMaterialShadowed.BUY_FS_5.price;
                        }
                        if (esStartFS == 10) {
                            this.failstacks.get(10).amount++;
                            this.failstacks.get(10).value += EnchantmentMaterialShadowed.BUY_FS_10.use();
                            this.failstacks.get(10).total_amount++;
                            this.failstacks.get(10).total_value += EnchantmentMaterialShadowed.BUY_FS_10.price;
                        }
                        if (esStartFS == 15) {
                            this.failstacks.get(15).amount++;
                            this.failstacks.get(15).value += EnchantmentMaterialShadowed.BUY_FS_15.use();
                            this.failstacks.get(15).total_amount++;
                            this.failstacks.get(15).total_value += EnchantmentMaterialShadowed.BUY_FS_15.price;
                        }
                        if (esStartFS == 20) {
                            this.failstacks.get(20).amount++;
                            this.failstacks.get(20).value += EnchantmentMaterialShadowed.BUY_FS_20.use();
                            this.failstacks.get(20).total_amount++;
                            this.failstacks.get(20).total_value += EnchantmentMaterialShadowed.BUY_FS_20.price;
                        }
                        if (esStartFS == 25) {
                            this.failstacks.get(25).amount++;
                            this.failstacks.get(25).value += EnchantmentMaterialShadowed.BUY_FS_25.use();
                            this.failstacks.get(25).total_amount++;
                            this.failstacks.get(25).total_value += EnchantmentMaterialShadowed.BUY_FS_25.price;
                        }
                        if (esStartFS == 30) {
                            this.failstacks.get(30).amount++;
                            this.failstacks.get(30).value += EnchantmentMaterialShadowed.BUY_FS_30.use();
                            this.failstacks.get(30).total_amount++;
                            this.failstacks.get(30).total_value += EnchantmentMaterialShadowed.BUY_FS_30.price;
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
                this.controller.getLastClick().set('keine mons');
                this.upgrading = false;
                fsFound = true;
            }
            if (fsFound)
                break;
        }
        if (this.currentFailstack.amount > 0 && esItem) {
            Logger.debug('found', this.currentFailstack);
            this.upgrade(esItem);
        }
        else
            Logger.debug('not found');
    }
    scaleOutput_OnChange(oldScaleOutput, newScaleOutput) {
        if (newScaleOutput)
            Logger.debug(`Now scales the Output`);
        else
            Logger.debug(`Now doesn't scale the Output`);
        this.refresh();
    }
    showDebug_OnChange(oldShowDebug, newShowDebug) {
        if (newShowDebug)
            Logger.debug(`Now shows debugging logs`);
        else
            Logger.debug(`Now hides debugging logs`);
        Logger.showDebugs = newShowDebug;
    }
    enchantmentItem_Amount_OnChange(ei_index, oldAmount, newAmount) {
        const enchantment_item = this.controller.getEnchantmentItem(ei_index);
        if (!enchantment_item)
            return Logger.warn(`There are no ${ei_index + 1} Enchantment Items`);
        Logger.debug(`The Amount of Enchantment Item (${ei_index}) has changed(${oldAmount} => ${newAmount})`);
    }
    enchantmentItem_WorthEach_OnChange(ei_index, oldWorthEach, newWorthEach) {
        const enchantment_item = this.controller.getEnchantmentItem(ei_index);
        if (!enchantment_item)
            return Logger.warn(`There are no ${ei_index + 1} Enchantment Items`);
        Logger.debug(`The Worth of each Enchantment Item (${ei_index}) has changed(${oldWorthEach} => ${newWorthEach})`);
    }
    addReblath_OnClick() {
        Logger.debug('Add new Reblath');
        this.addItem('Reblath');
        this.refresh();
    }
    addBlackStar_OnClick() {
        Logger.debug('Add new Blackstar');
        this.addItem('Blackstar');
        this.refresh();
    }
    familyFS_OnChange(oldFamilyFS, newFamilyFS) {
        Logger.debug(`The Family FS has changed(${oldFamilyFS} => ${newFamilyFS})`);
        const enchantment_step = this.controller.getEnchantmentStep(0);
        if (!enchantment_step)
            return Logger.warn('There are no Enchantment Steps');
        enchantment_step.startFS.value(newFamilyFS + this.controller.getBuyFS().value());
    }
    buyFS_OnChange(oldBuyFS, newBuyFS) {
        Logger.debug(`The Buy FS has changed(${oldBuyFS} => ${newBuyFS})`);
        const enchantment_step = this.controller.getEnchantmentStep(0);
        if (!enchantment_step)
            return Logger.warn('There are no Enchantment Steps');
        enchantment_step.startFS.value(this.controller.getFamilyFS().value() + newBuyFS);
    }
    targetAmount_OnChange(oldTargetAmount, newTargetAmount) {
        Logger.debug(`The Target Amount has changed(${oldTargetAmount} => ${newTargetAmount})`);
        this.refresh();
    }
    enchantmentStep_Item_OnChange(es_index, oldItem, newItem) {
        const enchantment_step = this.controller.getEnchantmentStep(es_index);
        if (!enchantment_step)
            return Logger.warn(`There are no ${es_index + 1} Enchantment Steps`);
        Logger.debug(`The Item of Step(${es_index}) has changed(${oldItem.name} => ${newItem.name})`);
        const startFS = enchantment_step.startFS.value();
        const clicks = enchantment_step.clicks.value();
        const endFS = startFS + newItem.failstack_increase * clicks;
        enchantment_step.endFS.value(endFS);
    }
    enchantmentStep_StartFS_OnChange(es_index, oldStartFS, newStartFS) {
        const enchantment_step = this.controller.getEnchantmentStep(es_index);
        if (!enchantment_step)
            return Logger.warn(`There are no ${es_index + 1} Enchantment Steps`);
        Logger.debug(`The Start FS of Step(${es_index}) has changed(${oldStartFS} => ${newStartFS})`);
        const inc_per_clicks = enchantment_step.item.value().failstack_increase;
        const clicks = enchantment_step.clicks.value();
        const endFS = newStartFS + inc_per_clicks * clicks;
        enchantment_step.endFS.value(endFS);
    }
    enchantmentStep_EndFS_OnChange(es_index, oldEndFS, newEndFS) {
        const enchantment_step = this.controller.getEnchantmentStep(es_index);
        if (!enchantment_step)
            return Logger.warn(`There are no ${es_index + 1} Enchantment Steps`);
        Logger.debug(`The End FS of Step(${es_index}) has changed(${oldEndFS} => ${newEndFS})`);
        if (es_index == this.controller.getEnchantmentStepsSize() - 1)
            this.refresh();
        const nextIndex = es_index + 1;
        if (nextIndex >= this.controller.getEnchantmentStepsSize())
            return;
        const es_next = this.controller.getEnchantmentStep(nextIndex);
        if (!es_next)
            return Logger.warn(`There are no ${nextIndex + 1} Enchantment Steps`);
        es_next.startFS.value(newEndFS);
    }
    enchantmentStep_Clicks_OnChange(es_index, oldClicks, newClicks) {
        const enchantment_step = this.controller.getEnchantmentStep(es_index);
        if (!enchantment_step)
            return Logger.warn(`There are no ${es_index + 1} Enchantment Steps`);
        Logger.debug(`The Clicks of Step(${es_index}) has changed(${oldClicks} => ${newClicks})`);
        const startFS = enchantment_step.startFS.value();
        const inc_per_clicks = enchantment_step.item.value().failstack_increase;
        const endFS = startFS + inc_per_clicks * newClicks;
        enchantment_step.endFS.value(endFS);
    }
    clicksPerIteration_OnChange(oldClicksPerIteration, newClicksPerIteration) {
        Logger.debug(`The Clicks per Iterations has changed(${oldClicksPerIteration} => ${newClicksPerIteration})`);
    }
    iterationsPerSecond_OnChange(oldIterationsPerSecond, newIterationsPerSecond) {
        Logger.debug(`The Iterations per Second has changed(${oldIterationsPerSecond} => ${newIterationsPerSecond})`);
    }
    async upgradeStartOnClick() {
        Logger.debug('Upgrade Start');
        this.upgrading = true;
        let iteration = 0;
        while (this.upgrading) {
            Logger.debug('Iteration: ' + iteration);
            for (let click = 0; this.upgrading && click < this.controller.getClicksPerIteration().value(); click++) {
                this.Enchantment();
            }
            this.refresh();
            const delay = 1000 / this.controller.getIterationsPerSecond().value();
            Logger.debug('delay: ' + delay);
            await new Promise(r => setTimeout(r, delay));
            iteration++;
        }
    }
    upgradeStop_OnClick() {
        Logger.debug('Upgrade Stop');
        this.upgrading = false;
    }
    singleClick_OnClick() {
        Logger.debug('Single Click');
        this.Enchantment();
        this.refresh();
    }
}
