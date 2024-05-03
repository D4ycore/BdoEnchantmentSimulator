import Controller from '../controller/Controller.js';
import Logger from '../util/Logger.js';
import { TEST_RNG } from '../util/TestRng.js';
import { nf, nf_commas, nf_fixed } from '../util/util.js';
import { SimulatorState, enchantment_item, enchantment_mat, enchantment_step } from '../view/View.js';
import EnchantmentItem, { ENCHANTMENT_ITEMS } from './EnchantmentItem.js';
import EnchantmentMaterial, { ENCHANTMENT_MATERIALS, EnchantmentMaterialShadowed } from './EnchantmentMaterial.js';
import { FailStack } from './FailStack.js';

export default class Logic {
	private initialized = false;

	private controller!: Controller;

	private currentFailstack: { tier: number; value: number; amount: number } = {
		tier: 0,
		value: 0,
		amount: 0
	};
	private failstacks: FailStack[] = [];

	private rand: TEST_RNG = new TEST_RNG(0);
	private upgrading: boolean = false;

	private clicks: number = 0;

	constructor() {
		for (let i = 0; i <= 500; i++) this.failstacks.push(new FailStack(i));
	}

	link(controller: Controller) {
		this.controller = controller;
	}

	init() {
		this.setupDemo();
		this.initialized = true;
		this.refresh(false);
	}

	private setupDemo() {
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
		for (let n = 0; n < 10; n++) this.addItem('Reblath');
	}

	private setupSilver() {
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
		for (let n = 0; n < 1000; n++) this.addItem('Reblath');
	}

	private setupOld() {
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
		for (let n = 0; n < 1000; n++) this.addItem('Reblath');
	}

	private addItem(item: string) {
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

	private refresh(saveState = true) {
		Logger.debug('refresh', this.initialized);
		if (!this.initialized) return;

		this.controller.getClicks().value(this.clicks);

		const monReblathText = this.controller.getEnchantmentItem(0)!;
		const duoReblathText = this.controller.getEnchantmentItem(1)!;
		const triReblathText = this.controller.getEnchantmentItem(2)!;
		const tetReblathText = this.controller.getEnchantmentItem(3)!;
		const penReblathText = this.controller.getEnchantmentItem(4)!;

		const monReblathPity = this.controller.getEnchantmentItem(0)!.pity;
		monReblathPity.current.value(EnchantmentItem.Reblath_Mon.pity.current);
		monReblathPity.max.value(EnchantmentItem.Reblath_Mon.pity.max);
		const duoReblathPity = this.controller.getEnchantmentItem(1)!.pity;
		duoReblathPity.current.value(EnchantmentItem.Reblath_Duo.pity.current);
		duoReblathPity.max.value(EnchantmentItem.Reblath_Duo.pity.max);
		const triReblathPity = this.controller.getEnchantmentItem(2)!.pity;
		triReblathPity.current.value(EnchantmentItem.Reblath_Tri.pity.current);
		triReblathPity.max.value(EnchantmentItem.Reblath_Tri.pity.max);
		const tetReblathPity = this.controller.getEnchantmentItem(3)!.pity;
		tetReblathPity.current.value(EnchantmentItem.Reblath_Tet.pity.current);
		tetReblathPity.max.value(EnchantmentItem.Reblath_Tet.pity.max);

		monReblathText.amount.value(EnchantmentItem.Reblath_Mon.amount);
		duoReblathText.amount.value(EnchantmentItem.Reblath_Duo.amount);
		triReblathText.amount.value(EnchantmentItem.Reblath_Tri.amount);
		tetReblathText.amount.value(EnchantmentItem.Reblath_Tet.amount);
		penReblathText.amount.value(EnchantmentItem.Reblath_Pen.amount);

		if (EnchantmentItem.Reblath_Duo.total_value)
			duoReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Duo.total_value / EnchantmentItem.Reblath_Duo.total_amount / 1_000_000.0, 3));
		else duoReblathText.worthEach.value(0);
		if (EnchantmentItem.Reblath_Tri.total_value)
			triReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Tri.total_value / EnchantmentItem.Reblath_Tri.total_amount / 1_000_000.0, 3));
		else triReblathText.worthEach.value(0);
		if (EnchantmentItem.Reblath_Tet.total_value)
			tetReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Tet.total_value / EnchantmentItem.Reblath_Tet.total_amount / 1_000_000.0, 3));
		else tetReblathText.worthEach.value(0);
		if (EnchantmentItem.Reblath_Pen.total_value)
			penReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Pen.total_value / EnchantmentItem.Reblath_Pen.total_amount / 1_000_000.0, 3));
		else penReblathText.worthEach.value(0);

		const scaleOutput = this.controller.getScaleOutput().value();
		const scalarr = this.controller.getTargetAmount().value();

		let text = '';
		for (let i = 1; i < this.failstacks.length; i++) {
			const fs = this.failstacks[i]!;
			if (fs.amount > 0) {
				const fsAmountPerTarget = scaleOutput ? nf_commas(fs.amount / scalarr, 2) : nf_commas(fs.amount);
				const fsValuePer = nf_commas(fs.value / fs.amount / 1_000_000, 3);
				text += ' fs:' + fs.tier + ' ' + fsAmountPerTarget + 'x each(' + fsValuePer + 'm) // ';
			}
		}
		const clicks = nf_commas(this.clicks);
		const costs = scaleOutput ? nf_commas(EnchantmentMaterial.total_cost() / 1_000_000 / scalarr, 3) : nf_commas(EnchantmentMaterial.total_cost() / 1_000_000);

		this.controller.getStacksCrafted().value(`clicks: ${clicks} | costs: ${costs} m | ` + text);

		// const evaluation = new Evaluation(this.failstacks.filter(fs => fs.amount > 0));
		// this.controller.getEvaluation().value(this.failstacks);
		// this.controller.getFailstacks().value(this.failstacks.filter(fs => fs.total_amount > 0));
		this.controller.getFailstacks().value(this.failstacks);

		const endFS_min = this.controller.getEnchantmentStep(this.controller.getEnchantmentStepsSize() - 1)!.endFS.value() - this.controller.getFamilyFS().value();
		let currentTargetFS = 0;
		for (let i = endFS_min; i < this.failstacks.length; i++) {
			const fs = this.failstacks[i]!;
			if (fs.amount) currentTargetFS += fs.amount;
		}
		this.controller.getCurrentTargetFS().value({ current: currentTargetFS, max: this.controller.getTargetAmount().value() });
		if (saveState) this.saveState();
	}

	private takeFs(x: number) {
		Logger.debug('takeFs', x);
		const matchingFS = this.failstacks[x]!;
		Logger.debug('targetFS-b', matchingFS);

		this.currentFailstack.tier = x;
		this.currentFailstack.value = matchingFS.value / matchingFS.amount;
		matchingFS.value -= matchingFS.value / matchingFS.amount;
		this.currentFailstack.amount = 1;
		matchingFS.amount -= 1;
		Logger.debug('targetFS-a', matchingFS);
	}

	private insertFs(pitySuccess: boolean) {
		Logger.debug('insertFs', this.currentFailstack);
		const matchingFS = this.failstacks[this.currentFailstack.tier]!;
		matchingFS.amount++;
		matchingFS.value += this.currentFailstack.value;
		if (!pitySuccess) {
			matchingFS.total_amount++;
			matchingFS.total_value += this.currentFailstack.value;
		}
	}

	private increaseFs(esItem: EnchantmentItem) {
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

	private resetFS() {
		Logger.debug('resetFS', this.currentFailstack);
		this.currentFailstack.tier = 0;
		this.currentFailstack.amount = 0;
		this.currentFailstack.value = 0;
	}

	private increaseItem(esItem: EnchantmentItem, pitySuccess: boolean) {
		Logger.debug('increaseItem', this.currentFailstack, esItem);
		switch (esItem) {
			case EnchantmentItem.Reblath_Tet:
				if (!pitySuccess) EnchantmentItem.Reblath_Pen.value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Pen.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
				EnchantmentItem.Reblath_Pen.value += EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
				EnchantmentItem.Reblath_Tet.value -= EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
				EnchantmentItem.Reblath_Pen.amount++;
				EnchantmentItem.Reblath_Tet.amount--;

				if (!pitySuccess) EnchantmentItem.Reblath_Pen.total_value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Pen.total_value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.price;
				EnchantmentItem.Reblath_Pen.total_value += EnchantmentItem.Reblath_Tet.total_value / EnchantmentItem.Reblath_Tet.total_amount;
				EnchantmentItem.Reblath_Pen.total_amount++;
				break;
			case EnchantmentItem.Reblath_Tri:
				if (!pitySuccess) EnchantmentItem.Reblath_Tet.value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Tet.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
				EnchantmentItem.Reblath_Tet.value += EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
				EnchantmentItem.Reblath_Tri.value -= EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
				EnchantmentItem.Reblath_Tet.amount++;
				EnchantmentItem.Reblath_Tri.amount--;

				if (!pitySuccess) EnchantmentItem.Reblath_Tet.total_value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Tet.total_value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.price;
				EnchantmentItem.Reblath_Tet.total_value += EnchantmentItem.Reblath_Tri.total_value / EnchantmentItem.Reblath_Tri.total_amount;
				EnchantmentItem.Reblath_Tet.total_amount++;
				break;
			case EnchantmentItem.Reblath_Duo:
				if (!pitySuccess) EnchantmentItem.Reblath_Tri.value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Tri.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
				EnchantmentItem.Reblath_Tri.value += EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
				EnchantmentItem.Reblath_Duo.value -= EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
				EnchantmentItem.Reblath_Tri.amount++;
				EnchantmentItem.Reblath_Duo.amount--;

				if (!pitySuccess) EnchantmentItem.Reblath_Tri.total_value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Tri.total_value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.price;
				EnchantmentItem.Reblath_Tri.total_value += EnchantmentItem.Reblath_Duo.total_value / EnchantmentItem.Reblath_Duo.total_amount;
				EnchantmentItem.Reblath_Tri.total_amount++;
				break;
			case EnchantmentItem.Reblath_Mon:
				if (!pitySuccess) EnchantmentItem.Reblath_Duo.value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Duo.value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.use();
				EnchantmentItem.Reblath_Duo.amount++;
				EnchantmentItem.Reblath_Mon.amount--;

				if (!pitySuccess) EnchantmentItem.Reblath_Duo.total_value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Duo.total_value += EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE.price;
				EnchantmentItem.Reblath_Duo.total_amount++;
				break;
			case EnchantmentItem.Blackstar_Tet:
				EnchantmentItem.Blackstar_Pen.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use();
				if (!pitySuccess) EnchantmentItem.Blackstar_Pen.value += this.currentFailstack.value;
				EnchantmentItem.Blackstar_Pen.value += EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
				EnchantmentItem.Blackstar_Tet.value -= EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
				EnchantmentItem.Blackstar_Pen.amount++;
				EnchantmentItem.Blackstar_Tet.amount--;
				break;
			case EnchantmentItem.Blackstar_Tri:
				EnchantmentItem.Blackstar_Tet.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use();
				if (!pitySuccess) EnchantmentItem.Blackstar_Tet.value += this.currentFailstack.value;
				EnchantmentItem.Blackstar_Tet.value += EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
				EnchantmentItem.Blackstar_Tri.value -= EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
				EnchantmentItem.Blackstar_Tet.amount++;
				EnchantmentItem.Blackstar_Tri.amount--;
				break;
			case EnchantmentItem.Blackstar_Duo:
				EnchantmentItem.Blackstar_Tri.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use();
				if (!pitySuccess) EnchantmentItem.Blackstar_Tri.value += this.currentFailstack.value;
				EnchantmentItem.Blackstar_Tri.value += EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
				EnchantmentItem.Blackstar_Duo.value -= EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
				EnchantmentItem.Blackstar_Tri.amount++;
				EnchantmentItem.Blackstar_Duo.amount--;
				break;
			case EnchantmentItem.Blackstar_Mon:
				EnchantmentItem.Blackstar_Duo.value += EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE.use();
				if (!pitySuccess) EnchantmentItem.Blackstar_Duo.value += this.currentFailstack.value;
				EnchantmentItem.Blackstar_Duo.amount++;
				EnchantmentItem.Blackstar_Mon.amount--;
				break;
		}
	}

	private decreaseItem(esItem: EnchantmentItem) {
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

	private upgrade(esItem: EnchantmentItem) {
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
		} else {
			const roll: number = Math.random() * 100; // this.rand.nextFloat() * 100;
			const uppBaseChance = esItem.base_chance;
			const uppFS = this.currentFailstack.tier + this.controller.getFamilyFS().value();
			const uppChance = uppBaseChance + (uppFS * uppBaseChance) / 10;

			if (roll < uppChance) {
				message += `Succeeded with a Failstack of ${this.currentFailstack.tier}`;
				message += `, because ${nf_fixed(roll, 2)} < ${nf_fixed(uppChance, 2)}`;
				this.increaseItem(esItem, false);
				this.resetFS();
				pity.reset();
			} else {
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

		const endFS_min = this.controller.getEnchantmentStep(this.controller.getEnchantmentStepsSize() - 1)!.endFS.value() - this.controller.getFamilyFS().value();
		const targetAmount = this.controller.getTargetAmount().value();

		let currentTargetFS = 0;
		for (let i = endFS_min; i < this.failstacks.length; i++) {
			const fs = this.failstacks[i]!;
			if (fs.amount) currentTargetFS += fs.amount;
		}

		if (currentTargetFS >= targetAmount) this.upgrading = false;
	}

	private Enchantment() {
		this.clicks += 1;

		Logger.debug('Enchantment', this.controller.getEnchantmentStepsSize(), this.currentFailstack);

		let esItem;
		for (let es_index = this.controller.getEnchantmentStepsSize() - 1; es_index >= 0; es_index--) {
			Logger.debug('Enchantment Step', es_index);
			let fsFound = false;

			const enchantmentStep = this.controller.getEnchantmentStep(es_index)!;
			esItem = enchantmentStep.item.value();
			const esStartFS = enchantmentStep.startFS.value() - this.controller.getFamilyFS().value();
			const esEndFS = enchantmentStep.endFS.value() - this.controller.getFamilyFS().value();

			if (
				(esItem == EnchantmentItem.Reblath_Tet && EnchantmentItem.Reblath_Tet.amount > 0) ||
				(esItem == EnchantmentItem.Reblath_Tri && EnchantmentItem.Reblath_Tri.amount > 0) ||
				(esItem == EnchantmentItem.Blackstar_Tet && EnchantmentItem.Blackstar_Tet.amount > 0) ||
				(esItem == EnchantmentItem.Blackstar_Tri && EnchantmentItem.Blackstar_Tri.amount > 0) ||
				(esItem == EnchantmentItem.Blackstar_Duo && EnchantmentItem.Blackstar_Duo.amount > 0)
			) {
				for (let j = esEndFS - 1; j >= esStartFS; j--) {
					if (this.failstacks[j]!.amount > 0) {
						this.takeFs(j);
						fsFound = true;
						break;
					}
				}
			} else if (esItem == EnchantmentItem.Reblath_Duo && EnchantmentItem.Reblath_Duo.amount > 0) {
				for (let j = esEndFS - 1; j >= esStartFS; j--) {
					if (j == esStartFS && this.failstacks[j]!.amount == 0 && esStartFS <= 30) {
						this.failstacks[30]!.amount++;
						this.failstacks[30]!.value += EnchantmentMaterialShadowed.BUY_FS_30.use();
						this.failstacks[30]!.total_amount++;
						this.failstacks[30]!.total_value += EnchantmentMaterialShadowed.BUY_FS_30.price;
						j = 30;
					}
					if (j >= esStartFS && this.failstacks[j]!.amount > 0) {
						this.takeFs(j);
						fsFound = true;
						break;
					}
				}
			} else if (
				(esItem == EnchantmentItem.Reblath_Mon && EnchantmentItem.Reblath_Mon.amount > 0) ||
				(esItem == EnchantmentItem.Blackstar_Mon && EnchantmentItem.Blackstar_Mon.amount > 0)
			) {
				for (let j = esEndFS - 1; j >= esStartFS; j--) {
					if (j == esStartFS && this.failstacks[j]!.amount == 0) {
						if (esStartFS == 5) {
							this.failstacks[5]!.amount++;
							this.failstacks[5]!.value += EnchantmentMaterialShadowed.BUY_FS_5.use();
							this.failstacks[5]!.total_amount++;
							this.failstacks[5]!.total_value += EnchantmentMaterialShadowed.BUY_FS_5.price;
						}
						if (esStartFS == 10) {
							this.failstacks[10]!.amount++;
							this.failstacks[10]!.value += EnchantmentMaterialShadowed.BUY_FS_10.use();
							this.failstacks[10]!.total_amount++;
							this.failstacks[10]!.total_value += EnchantmentMaterialShadowed.BUY_FS_10.price;
						}
						if (esStartFS == 15) {
							this.failstacks[15]!.amount++;
							this.failstacks[15]!.value += EnchantmentMaterialShadowed.BUY_FS_15.use();
							this.failstacks[15]!.total_amount++;
							this.failstacks[15]!.total_value += EnchantmentMaterialShadowed.BUY_FS_15.price;
						}
						if (esStartFS == 20) {
							this.failstacks[20]!.amount++;
							this.failstacks[20]!.value += EnchantmentMaterialShadowed.BUY_FS_20.use();
							this.failstacks[20]!.total_amount++;
							this.failstacks[20]!.total_value += EnchantmentMaterialShadowed.BUY_FS_20.price;
						}
						if (esStartFS == 25) {
							this.failstacks[25]!.amount++;
							this.failstacks[25]!.value += EnchantmentMaterialShadowed.BUY_FS_25.use();
							this.failstacks[25]!.total_amount++;
							this.failstacks[25]!.total_value += EnchantmentMaterialShadowed.BUY_FS_25.price;
						}
						if (esStartFS == 30) {
							this.failstacks[30]!.amount++;
							this.failstacks[30]!.value += EnchantmentMaterialShadowed.BUY_FS_30.use();
							this.failstacks[30]!.total_amount++;
							this.failstacks[30]!.total_value += EnchantmentMaterialShadowed.BUY_FS_30.price;
						}
					}
					if (j >= esStartFS && this.failstacks[j]!.amount > 0) {
						this.takeFs(j);
						fsFound = true;
						break;
					}
				}
			} else if (esItem == EnchantmentItem.Reblath_Mon && EnchantmentItem.Reblath_Mon.amount == 0) {
				this.controller.getLastClick().value('keine mons');
				this.upgrading = false;
				fsFound = true;
			}

			if (fsFound) break;
		}

		if (this.currentFailstack.amount > 0 && esItem) {
			Logger.debug('found', this.currentFailstack);
			this.upgrade(esItem);
		} else Logger.debug('not found');
	}

	/*
		Handlers
	*/

	scaleOutput_OnChange(oldScaleOutput: boolean, newScaleOutput: boolean): void {
		if (newScaleOutput) Logger.debug(`Now scales the Output`);
		else Logger.debug(`Now doesn't scale the Output`);
		this.refresh();
	}

	showDebug_OnChange(oldShowDebug: boolean, newShowDebug: boolean): void {
		if (newShowDebug) Logger.debug(`Now shows debugging logs`);
		else Logger.debug(`Now hides debugging logs`);
		Logger.showDebugs = newShowDebug;
	}

	/* Unused */
	enchantmentItem_Amount_OnChange(ei_index: number, oldAmount: number, newAmount: number) {
		const enchantment_item = this.controller.getEnchantmentItem(ei_index);
		if (!enchantment_item) return Logger.warn(`There are no ${ei_index + 1} Enchantment Items`);

		Logger.debug(`The Amount of Enchantment Item (${ei_index}) has changed(${oldAmount} => ${newAmount})`);
	}
	/* Unused */
	enchantmentItem_WorthEach_OnChange(ei_index: number, oldWorthEach: number, newWorthEach: number) {
		const enchantment_item = this.controller.getEnchantmentItem(ei_index);
		if (!enchantment_item) return Logger.warn(`There are no ${ei_index + 1} Enchantment Items`);

		Logger.debug(`The Worth of each Enchantment Item (${ei_index}) has changed(${oldWorthEach} => ${newWorthEach})`);
	}
	addReblath_OnClick() {
		Logger.debug('Add new Reblath');
		this.addItem('Reblath');
		this.refresh();
	}
	/* Not Connected */
	addBlackStar_OnClick() {
		Logger.debug('Add new Blackstar');
		this.addItem('Blackstar');
		this.refresh();
	}

	familyFS_OnChange(oldFamilyFS: number, newFamilyFS: number) {
		Logger.debug(`The Family FS has changed(${oldFamilyFS} => ${newFamilyFS})`);

		const enchantment_step = this.controller.getEnchantmentStep(0);
		if (!enchantment_step) return Logger.warn('There are no Enchantment Steps');

		enchantment_step.startFS.value(newFamilyFS + this.controller.getBuyFS().value());
	}
	buyFS_OnChange(oldBuyFS: number, newBuyFS: number) {
		Logger.debug(`The Buy FS has changed(${oldBuyFS} => ${newBuyFS})`);

		const enchantment_step = this.controller.getEnchantmentStep(0);
		if (!enchantment_step) return Logger.warn('There are no Enchantment Steps');

		enchantment_step.startFS.value(this.controller.getFamilyFS().value() + newBuyFS);
	}

	targetAmount_OnChange(oldTargetAmount: number, newTargetAmount: number) {
		Logger.debug(`The Target Amount has changed(${oldTargetAmount} => ${newTargetAmount})`);
		this.refresh();
	}

	enchantmentStep_Item_OnChange(es_index: number, oldItem: EnchantmentItem, newItem: EnchantmentItem) {
		const enchantment_step = this.controller.getEnchantmentStep(es_index);
		if (!enchantment_step) return Logger.warn(`There are no ${es_index + 1} Enchantment Steps`);

		Logger.debug(`The Item of Step(${es_index}) has changed(${oldItem.name} => ${newItem.name})`);

		const startFS = enchantment_step.startFS.value();
		const clicks = enchantment_step.clicks.value();
		const endFS: number = startFS + newItem.failstack_increase * clicks;
		enchantment_step.endFS.value(endFS);
	}
	enchantmentStep_StartFS_OnChange(es_index: number, oldStartFS: number, newStartFS: number) {
		const enchantment_step = this.controller.getEnchantmentStep(es_index);
		if (!enchantment_step) return Logger.warn(`There are no ${es_index + 1} Enchantment Steps`);

		Logger.debug(`The Start FS of Step(${es_index}) has changed(${oldStartFS} => ${newStartFS})`);

		const inc_per_clicks = enchantment_step.item.value().failstack_increase;
		const clicks = enchantment_step.clicks.value();
		const endFS: number = newStartFS + inc_per_clicks * clicks;
		enchantment_step.endFS.value(endFS);
	}
	enchantmentStep_EndFS_OnChange(es_index: number, oldEndFS: number, newEndFS: number) {
		const enchantment_step = this.controller.getEnchantmentStep(es_index);
		if (!enchantment_step) return Logger.warn(`There are no ${es_index + 1} Enchantment Steps`);

		Logger.debug(`The End FS of Step(${es_index}) has changed(${oldEndFS} => ${newEndFS})`);

		if (es_index == this.controller.getEnchantmentStepsSize() - 1) this.refresh();

		const nextIndex = es_index + 1;
		if (nextIndex >= this.controller.getEnchantmentStepsSize()) return;

		const es_next = this.controller.getEnchantmentStep(nextIndex);
		if (!es_next) return Logger.warn(`There are no ${nextIndex + 1} Enchantment Steps`);
		es_next.startFS.value(newEndFS);
	}
	enchantmentStep_Clicks_OnChange(es_index: number, oldClicks: number, newClicks: number) {
		const enchantment_step = this.controller.getEnchantmentStep(es_index);
		if (!enchantment_step) return Logger.warn(`There are no ${es_index + 1} Enchantment Steps`);

		Logger.debug(`The Clicks of Step(${es_index}) has changed(${oldClicks} => ${newClicks})`);

		const startFS = enchantment_step.startFS.value();
		const inc_per_clicks = enchantment_step.item.value().failstack_increase;
		const endFS: number = startFS + inc_per_clicks * newClicks;
		enchantment_step.endFS.value(endFS);
	}

	/* Unused */
	clicksPerIteration_OnChange(oldClicksPerIteration: number, newClicksPerIteration: number) {
		Logger.debug(`The Clicks per Iterations has changed(${oldClicksPerIteration} => ${newClicksPerIteration})`);
	}
	/* Unused */
	iterationsPerSecond_OnChange(oldIterationsPerSecond: number, newIterationsPerSecond: number) {
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

	saveState() {
		const enchantment_steps: enchantment_step[] = [];
		const stepsSize = this.controller.getEnchantmentStepsSize();
		for (let es_index = 0; es_index < stepsSize; es_index++) {
			const enchantment_step = this.controller.getEnchantmentStep(es_index)!;
			enchantment_steps.push({ index: es_index, item_name: enchantment_step.item.value().name, clicks: enchantment_step.clicks.value() });
		}
		const enchantment_items: enchantment_item[] = [];
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
		const enchantment_mats: enchantment_mat[] = ENCHANTMENT_MATERIALS.map(material => {
			return { name: material.name, used: material.used, price: material.price };
		});
		const state = new SimulatorState(
			this.controller.getFamilyFS().value(),
			this.controller.getBuyFS().value(),
			this.controller.getTargetAmount().value(),
			this.controller.getClicksPerIteration().value(),
			this.controller.getIterationsPerSecond().value(),
			enchantment_steps,
			enchantment_items,
			this.clicks,
			this.failstacks,
			enchantment_mats
		);
		this.controller.saveState(state);
	}

	loadState(state: SimulatorState) {
		this.upgrading = false;
		this.initialized = false;

		this.controller.getFamilyFS().value(state.familyFS);
		this.controller.getBuyFS().value(state.buyFS);
		this.controller.getTargetAmount().value(state.targetAmount);
		this.controller.getClicksPerIteration().value(state.clicksPerIteration);
		this.controller.getIterationsPerSecond().value(state.iterationsPerSecond);
		for (const enchantment_step of state.enchantment_steps) {
			this.controller.getEnchantmentStep(enchantment_step.index)?.item.value(ENCHANTMENT_ITEMS.get(enchantment_step.item_name));
			this.controller.getEnchantmentStep(enchantment_step.index)?.clicks.value(enchantment_step.clicks);
		}
		EnchantmentItem.Reblath_Mon.amount = EnchantmentItem.Reblath_Mon.amount + 10;
		for (const enchantment_item of state.enchantment_items) {
			const item = ENCHANTMENT_ITEMS.get(enchantment_item.name);
			if (!item) continue;
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
			if (!material) continue;
			material.price = enchantment_mat.price;
			material.used = enchantment_mat.used;
		}
		console.log('loaded');

		this.initialized = true;
		this.refresh(false);
	}
}
