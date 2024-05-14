import Logger from '../util/Logger.js';
import { TEST_RNG } from '../util/TestRng.js';
import { nf, nf_commas, nf_fixed } from '../util/util.js';
import { SimulatorState } from '../view/View.js';
import EnchantmentItem, { ENCHANTMENT_ITEMS } from './EnchantmentItem.js';
import EnchantmentMaterial, { ENCHANTMENT_MATERIALS, EnchantmentMaterialShadowed } from './EnchantmentMaterial.js';
import EnchantmentPreset, { ENCHANTMENT_PRESETS } from './EnchantmentPreset.js';
import { FailStack } from './FailStack.js';
export default class Logic {
    constructor() {
        this.loadingState = false;
        this.skipRefresh = true;
        this.currentFailstack = {
            tier: 0,
            value: 0,
            amount: 0
        };
        this.failstacks = [];
        this.rand = new TEST_RNG(0);
        this.upgrading = false;
        this.clicks = 0;
        for (let i = 0; i <= 500; i++)
            this.failstacks.push(new FailStack(i));
    }
    link(controller) {
        this.controller = controller;
    }
    init() {
        this.skipRefresh = false;
    }
    reset() {
        for (let i = 0; i <= 500; i++) {
            const failstack = this.failstacks[i];
            failstack.amount = failstack.value = failstack.total_amount = failstack.total_value = 0;
        }
        ENCHANTMENT_ITEMS.forEach(item => item.reset());
        ENCHANTMENT_MATERIALS.forEach(material => material.reset());
        this.clicks = 0;
        this.controller.getLastClick().value('');
        this.setupPreset(this.controller.getPreset().value());
        this.refresh();
    }
    setupPreset(preset = EnchantmentPreset.preset_default) {
        if (this.loadingState)
            return;
        Logger.debug('setup preset', preset);
        this.skipRefresh = true;
        this.controller.getFamilyFS().value(preset.familyFS);
        this.controller.getBuyFS().value(preset.buyFS);
        this.controller.getTargetAmount().value(preset.targetAmount);
        for (let index = 0; index < preset.enchantmentSteps.length; index++) {
            const enchantment_step = preset.enchantmentSteps[index];
            this.controller.getEnchantmentStep(index)?.item.value(enchantment_step.item);
            this.controller.getEnchantmentStep(index)?.clicks.value(enchantment_step.clicks);
        }
        this.controller.getClicksPerIteration().value(preset.clicksPerIteration);
        this.controller.getIterationsPerSecond().value(preset.iterationsPerSecond);
        EnchantmentItem.Reblath_Mon.amount = preset.reblaths;
        this.skipRefresh = false;
        this.refresh();
    }
    refresh() {
        Logger.debug('refresh', this.skipRefresh);
        if (this.skipRefresh)
            return;
        this.controller.getClicks().value(this.clicks);
        const monReblath = this.controller.getEnchantmentItem(0);
        const duoReblath = this.controller.getEnchantmentItem(1);
        const triReblath = this.controller.getEnchantmentItem(2);
        const tetReblath = this.controller.getEnchantmentItem(3);
        const penReblath = this.controller.getEnchantmentItem(4);
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
        monReblath.amount.value(EnchantmentItem.Reblath_Mon.amount);
        duoReblath.amount.value(EnchantmentItem.Reblath_Duo.amount);
        triReblath.amount.value(EnchantmentItem.Reblath_Tri.amount);
        tetReblath.amount.value(EnchantmentItem.Reblath_Tet.amount);
        penReblath.amount.value(EnchantmentItem.Reblath_Pen.amount);
        if (EnchantmentItem.Reblath_Duo.total_value)
            duoReblath.worthEach.value(nf(EnchantmentItem.Reblath_Duo.total_value / EnchantmentItem.Reblath_Duo.total_amount / 1000000, 3));
        else
            duoReblath.worthEach.value(0);
        if (EnchantmentItem.Reblath_Tri.total_value)
            triReblath.worthEach.value(nf(EnchantmentItem.Reblath_Tri.total_value / EnchantmentItem.Reblath_Tri.total_amount / 1000000, 3));
        else
            triReblath.worthEach.value(0);
        if (EnchantmentItem.Reblath_Tet.total_value)
            tetReblath.worthEach.value(nf(EnchantmentItem.Reblath_Tet.total_value / EnchantmentItem.Reblath_Tet.total_amount / 1000000, 3));
        else
            tetReblath.worthEach.value(0);
        if (EnchantmentItem.Reblath_Pen.total_value)
            penReblath.worthEach.value(nf(EnchantmentItem.Reblath_Pen.total_value / EnchantmentItem.Reblath_Pen.total_amount / 1000000, 3));
        else
            penReblath.worthEach.value(0);
        const scaleOutput = this.controller.getScaleOutput().value();
        const scalar = 1 / this.controller.getTargetAmount().value();
        let text = '';
        for (let i = 1; i < this.failstacks.length; i++) {
            const fs = this.failstacks[i];
            if (fs.amount > 0) {
                const fsAmountPerTarget = scaleOutput ? nf_commas(fs.amount * scalar, 2) : nf_commas(fs.amount);
                const fsValuePer = nf_commas(fs.value / fs.amount / 1000000, 3);
                text += ' fs:' + fs.tier + ' ' + fsAmountPerTarget + 'x each(' + fsValuePer + 'm) // ';
            }
        }
        const clicks = scaleOutput ? nf_commas(this.clicks * scalar) : nf_commas(this.clicks);
        const costs = scaleOutput ? nf_commas((EnchantmentMaterial.total_cost() / 1000000) * scalar, 3) : nf_commas(EnchantmentMaterial.total_cost() / 1000000);
        this.controller.getStacksCrafted().value(`clicks: ${clicks} | costs: ${costs} m | ` + text);
        this.controller.getFailstacks().value(this.failstacks);
        const endFS_min = this.controller.getEnchantmentStep(this.controller.getEnchantmentStepsSize() - 1).endFS.value() - this.controller.getFamilyFS().value();
        let currentTargetFS = 0;
        for (let i = endFS_min; i < this.failstacks.length; i++) {
            const fs = this.failstacks[i];
            if (fs.amount)
                currentTargetFS += fs.amount;
        }
        this.controller.getCurrentTargetFS().value({ current: currentTargetFS, max: this.controller.getTargetAmount().value() });
        this.controller.getSaveState().consume(this.getState());
    }
    takeFs(x) {
        Logger.debug('takeFs', x);
        const matchingFS = this.failstacks[x];
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
        const matchingFS = this.failstacks[this.currentFailstack.tier];
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
        this.controller.getLastClick().value(message);
        const endFS_min = this.controller.getEnchantmentStep(this.controller.getEnchantmentStepsSize() - 1).endFS.value() - this.controller.getFamilyFS().value();
        const targetAmount = this.controller.getTargetAmount().value();
        let currentTargetFS = 0;
        for (let i = endFS_min; i < this.failstacks.length; i++) {
            const fs = this.failstacks[i];
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
                    if (this.failstacks[j].amount > 0) {
                        this.takeFs(j);
                        fsFound = true;
                        break;
                    }
                }
            }
            else if (esItem == EnchantmentItem.Reblath_Duo && EnchantmentItem.Reblath_Duo.amount > 0) {
                for (let j = esEndFS - 1; j >= esStartFS; j--) {
                    if (j == esStartFS && this.failstacks[j].amount == 0 && esStartFS <= 30) {
                        this.failstacks[30].amount++;
                        this.failstacks[30].value += EnchantmentMaterialShadowed.BUY_FS_30.use();
                        this.failstacks[30].total_amount++;
                        this.failstacks[30].total_value += EnchantmentMaterialShadowed.BUY_FS_30.price;
                        j = 30;
                    }
                    if (j >= esStartFS && this.failstacks[j].amount > 0) {
                        this.takeFs(j);
                        fsFound = true;
                        break;
                    }
                }
            }
            else if ((esItem == EnchantmentItem.Reblath_Mon && EnchantmentItem.Reblath_Mon.amount > 0) ||
                (esItem == EnchantmentItem.Blackstar_Mon && EnchantmentItem.Blackstar_Mon.amount > 0)) {
                for (let j = esEndFS - 1; j >= esStartFS; j--) {
                    if (j == esStartFS && this.failstacks[j].amount == 0) {
                        if (esStartFS == 5) {
                            this.failstacks[5].amount++;
                            this.failstacks[5].value += EnchantmentMaterialShadowed.BUY_FS_5.use();
                            this.failstacks[5].total_amount++;
                            this.failstacks[5].total_value += EnchantmentMaterialShadowed.BUY_FS_5.price;
                        }
                        if (esStartFS == 10) {
                            this.failstacks[10].amount++;
                            this.failstacks[10].value += EnchantmentMaterialShadowed.BUY_FS_10.use();
                            this.failstacks[10].total_amount++;
                            this.failstacks[10].total_value += EnchantmentMaterialShadowed.BUY_FS_10.price;
                        }
                        if (esStartFS == 15) {
                            this.failstacks[15].amount++;
                            this.failstacks[15].value += EnchantmentMaterialShadowed.BUY_FS_15.use();
                            this.failstacks[15].total_amount++;
                            this.failstacks[15].total_value += EnchantmentMaterialShadowed.BUY_FS_15.price;
                        }
                        if (esStartFS == 20) {
                            this.failstacks[20].amount++;
                            this.failstacks[20].value += EnchantmentMaterialShadowed.BUY_FS_20.use();
                            this.failstacks[20].total_amount++;
                            this.failstacks[20].total_value += EnchantmentMaterialShadowed.BUY_FS_20.price;
                        }
                        if (esStartFS == 25) {
                            this.failstacks[25].amount++;
                            this.failstacks[25].value += EnchantmentMaterialShadowed.BUY_FS_25.use();
                            this.failstacks[25].total_amount++;
                            this.failstacks[25].total_value += EnchantmentMaterialShadowed.BUY_FS_25.price;
                        }
                        if (esStartFS == 30) {
                            this.failstacks[30].amount++;
                            this.failstacks[30].value += EnchantmentMaterialShadowed.BUY_FS_30.use();
                            this.failstacks[30].total_amount++;
                            this.failstacks[30].total_value += EnchantmentMaterialShadowed.BUY_FS_30.price;
                        }
                    }
                    if (j >= esStartFS && this.failstacks[j].amount > 0) {
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
        switch (ei_index) {
            case 0:
                EnchantmentItem.Reblath_Mon.amount = enchantment_item.amount.value();
                break;
            case 1:
                EnchantmentItem.Reblath_Duo.amount = enchantment_item.amount.value();
                break;
            case 2:
                EnchantmentItem.Reblath_Tri.amount = enchantment_item.amount.value();
                break;
            case 3:
                EnchantmentItem.Reblath_Tet.amount = enchantment_item.amount.value();
                break;
            case 4:
                EnchantmentItem.Reblath_Pen.amount = enchantment_item.amount.value();
                break;
        }
        this.controller.getFailstacks().value(this.failstacks);
    }
    enchantmentItem_WorthEach_OnChange(ei_index, oldWorthEach, newWorthEach) {
        const enchantment_item = this.controller.getEnchantmentItem(ei_index);
        if (!enchantment_item)
            return Logger.warn(`There are no ${ei_index + 1} Enchantment Items`);
        Logger.debug(`The Worth of each Enchantment Item (${ei_index}) has changed(${oldWorthEach} => ${newWorthEach})`);
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
        const nextIndex = es_index + 1;
        if (nextIndex >= this.controller.getEnchantmentStepsSize()) {
            this.refresh();
            return;
        }
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
    reset_OnClick() {
        Logger.debug('Reset');
        this.reset();
        this.refresh();
    }
    getState() {
        const enchantment_steps = [];
        const stepsSize = this.controller.getEnchantmentStepsSize();
        for (let es_index = 0; es_index < stepsSize; es_index++) {
            const enchantment_step = this.controller.getEnchantmentStep(es_index);
            enchantment_steps.push({ index: es_index, item_name: enchantment_step.item.value().name, clicks: enchantment_step.clicks.value() });
        }
        const enchantment_items = [];
        for (const [, enchantment_item] of ENCHANTMENT_ITEMS) {
            enchantment_items.push({
                name: enchantment_item.name,
                amount: enchantment_item.amount,
                value: enchantment_item.value,
                total_amount: enchantment_item.total_amount,
                total_value: enchantment_item.total_value,
                pity: { current: enchantment_item.pity.current, max: enchantment_item.pity.max }
            });
        }
        const enchantment_mats = ENCHANTMENT_MATERIALS.map(material => {
            return { name: material.name, used: material.used, price: material.price };
        });
        const state = new SimulatorState(this.controller.getFamilyFS().value(), this.controller.getBuyFS().value(), this.controller.getTargetAmount().value(), this.controller.getClicksPerIteration().value(), this.controller.getIterationsPerSecond().value(), enchantment_steps, enchantment_items, this.clicks, this.failstacks, enchantment_mats, this.controller.getPreset().value()?.name);
        return state;
    }
    loadState(state) {
        this.upgrading = false;
        this.loadingState = true;
        this.skipRefresh = true;
        this.controller.getFamilyFS().value(state.familyFS);
        this.controller.getBuyFS().value(state.buyFS);
        this.controller.getTargetAmount().value(state.targetAmount);
        this.controller.getClicksPerIteration().value(state.clicksPerIteration);
        this.controller.getIterationsPerSecond().value(state.iterationsPerSecond);
        for (const enchantment_step of state.enchantment_steps) {
            this.controller.getEnchantmentStep(enchantment_step.index)?.item.value(ENCHANTMENT_ITEMS.get(enchantment_step.item_name));
            this.controller.getEnchantmentStep(enchantment_step.index)?.clicks.value(enchantment_step.clicks);
        }
        for (const enchantment_item of state.enchantment_items) {
            const item = ENCHANTMENT_ITEMS.get(enchantment_item.name);
            if (!item)
                continue;
            item.amount = enchantment_item.amount;
            item.value = enchantment_item.value;
            item.total_amount = enchantment_item.total_amount;
            item.total_value = enchantment_item.total_value;
            item.pity.current = enchantment_item.pity.current;
        }
        this.clicks = state.clicks;
        this.failstacks = state.failstacks;
        for (const enchantment_mat of state.materials) {
            const material = ENCHANTMENT_MATERIALS.find(material => material.name == enchantment_mat.name);
            if (!material)
                continue;
            material.price = enchantment_mat.price;
            material.used = enchantment_mat.used;
        }
        const preset = ENCHANTMENT_PRESETS.get(state.preset ?? '');
        this.controller.getPreset().value(preset);
        this.loadingState = false;
        this.skipRefresh = false;
        this.refresh();
    }
}
