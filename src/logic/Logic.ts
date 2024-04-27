import Controller from '../controller/Controller.js';
import {
	BLACKSTART_MON,
	BUY_FS_10,
	BUY_FS_15,
	BUY_FS_20,
	BUY_FS_25,
	BUY_FS_30,
	BUY_FS_5,
	CONCENTRATED_MAGICAL_BLACKSTONE,
	FLAWLESS_MAGICAL_BLACKSTONE,
	MEMORY_FRAGMENT
} from '../util/constants.js';
import Logger from '../util/Logger.js';
import { TEST_RNG } from '../util/TestRng.js';
import { nf } from '../util/util.js';
import EnchantmentItem from './EnchantmentItem.js';
import { FailStack } from './FailStack.js';

export default class Logic {
	private controller!: Controller;

	private currentFailstack = new FailStack();
	private failstacks = new Map<number, FailStack>();

	private rand: TEST_RNG = new TEST_RNG(0);
	private upgrading: boolean = false;

	private price: number = 0;
	private clicks: number = 0;

	link(controller: Controller) {
		this.controller = controller;
	}

	init() {
		for (let i = 1; i < 500; i++) {
			this.failstacks.set(i, new FailStack(i, 0, 0));
		}

		this.setupDemo();
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
		this.refresh();
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
		this.refresh();
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
		this.refresh();
	}

	private addItem(item: string) {
		Logger.debug('addItem', item);
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

	private refresh() {
		Logger.debug('refresh', this.currentFailstack);

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

		penReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Pen.total_value / EnchantmentItem.Reblath_Pen.total_amount / 1_000_000.0, 2));
		tetReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Tet.total_value / EnchantmentItem.Reblath_Tet.total_amount / 1_000_000.0, 2));
		triReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Tri.total_value / EnchantmentItem.Reblath_Tri.total_amount / 1_000_000.0, 2));
		duoReblathText.worthEach.value(nf(EnchantmentItem.Reblath_Duo.total_value / EnchantmentItem.Reblath_Duo.total_amount / 1_000_000.0, 2));

		const scalar = this.controller.getScaleOutput().value() ? this.controller.getTargetAmount().value() : 1;

		let text = '';
		for (let i = 1; i < this.failstacks.size; i++) {
			const fs = this.failstacks.get(i);
			if (fs && fs.amount > 0) {
				const fsAmountPerTarget = nf(fs.amount / scalar, 2);
				const fsPricePer = nf(fs.value / fs.amount / 1_000_000, 2);
				text += ' fs:' + fs.tier + ' ' + fsAmountPerTarget + 'x each(' + fsPricePer + 'm) // ';
			}
		}
		const clicks = nf(this.clicks / scalar, 2);
		const price = nf(this.price / 1_000_000 / scalar, 2);

		this.controller.getStacksCrafted().value(`click: ${clicks} | price: ${price} | ` + text);
	}

	private takeFs(x: number) {
		Logger.debug('takeFs', x);
		const targetFS = this.failstacks.get(x)!;
		Logger.debug('targetFS-b', targetFS);

		this.currentFailstack.tier = x;
		this.currentFailstack.value = targetFS.value / targetFS.amount;
		targetFS.value -= this.currentFailstack.value;
		this.currentFailstack.amount = 1;
		targetFS.amount -= 1;
		Logger.debug('targetFS-a', targetFS);
	}

	private insertFs() {
		Logger.debug('insertFs', this.currentFailstack);
		const targetFs = this.failstacks.get(this.currentFailstack.tier)!;
		targetFs.amount++;
		targetFs.value += this.currentFailstack.value;
	}

	private increaseFs(esItem: EnchantmentItem) {
		Logger.debug('increaseFs', this.currentFailstack, esItem);
		this.currentFailstack.tier = this.currentFailstack.tier + esItem.failstack_increase;
		switch (esItem) {
			case EnchantmentItem.Reblath_Tet:
				this.currentFailstack.value = this.currentFailstack.value + CONCENTRATED_MAGICAL_BLACKSTONE + EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
				EnchantmentItem.Reblath_Tet.value = EnchantmentItem.Reblath_Tet.value - EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
				break;
			case EnchantmentItem.Reblath_Tri:
				this.currentFailstack.value = this.currentFailstack.value + CONCENTRATED_MAGICAL_BLACKSTONE + EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
				EnchantmentItem.Reblath_Tri.value = EnchantmentItem.Reblath_Tri.value - EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
				break;
			case EnchantmentItem.Reblath_Duo:
				this.currentFailstack.value = this.currentFailstack.value + CONCENTRATED_MAGICAL_BLACKSTONE + EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
				EnchantmentItem.Reblath_Duo.value = EnchantmentItem.Reblath_Duo.value - EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
				break;
			case EnchantmentItem.Reblath_Mon:
				this.currentFailstack.value = this.currentFailstack.value + CONCENTRATED_MAGICAL_BLACKSTONE;
				break;
			case EnchantmentItem.Blackstar_Tet:
				this.currentFailstack.value =
					this.currentFailstack.value + FLAWLESS_MAGICAL_BLACKSTONE + 20 * MEMORY_FRAGMENT + EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
				EnchantmentItem.Blackstar_Tet.value = EnchantmentItem.Blackstar_Tet.value - EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
				break;
			case EnchantmentItem.Blackstar_Tri:
				this.currentFailstack.value =
					this.currentFailstack.value + FLAWLESS_MAGICAL_BLACKSTONE + 20 * MEMORY_FRAGMENT + EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
				EnchantmentItem.Blackstar_Tri.value = EnchantmentItem.Blackstar_Tri.value - EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
				break;
			case EnchantmentItem.Blackstar_Duo:
				this.currentFailstack.value =
					this.currentFailstack.value + FLAWLESS_MAGICAL_BLACKSTONE + 20 * MEMORY_FRAGMENT + EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
				EnchantmentItem.Blackstar_Duo.value = EnchantmentItem.Blackstar_Duo.value - EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
				break;
			case EnchantmentItem.Blackstar_Mon:
				this.currentFailstack.value = this.currentFailstack.value + FLAWLESS_MAGICAL_BLACKSTONE + 20 * MEMORY_FRAGMENT;
				break;
		}
	}

	private deleteFs() {
		Logger.debug('deleteFs', this.currentFailstack);
		this.currentFailstack.tier = 0;
		this.currentFailstack.amount = 0;
		this.currentFailstack.value = 0;
	}

	private increaseItem(esItem: EnchantmentItem, pitySuccess = false) {
		Logger.debug('itemIncrease', this.currentFailstack, esItem);
		switch (esItem) {
			case EnchantmentItem.Reblath_Tet:
				EnchantmentItem.Reblath_Pen.value += CONCENTRATED_MAGICAL_BLACKSTONE;
				if (!pitySuccess) EnchantmentItem.Reblath_Pen.value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Pen.value += EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
				EnchantmentItem.Reblath_Tet.value -= EnchantmentItem.Reblath_Tet.value / EnchantmentItem.Reblath_Tet.amount;
				EnchantmentItem.Reblath_Pen.amount++;
				EnchantmentItem.Reblath_Tet.amount--;

				if (!pitySuccess) EnchantmentItem.Reblath_Pen.total_value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Pen.total_value += CONCENTRATED_MAGICAL_BLACKSTONE + EnchantmentItem.Reblath_Tet.total_value / EnchantmentItem.Reblath_Tet.total_amount;
				EnchantmentItem.Reblath_Pen.total_amount++;
				break;
			case EnchantmentItem.Reblath_Tri:
				EnchantmentItem.Reblath_Tet.value += CONCENTRATED_MAGICAL_BLACKSTONE;
				if (!pitySuccess) EnchantmentItem.Reblath_Tet.value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Tet.value += EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
				EnchantmentItem.Reblath_Tri.value -= EnchantmentItem.Reblath_Tri.value / EnchantmentItem.Reblath_Tri.amount;
				EnchantmentItem.Reblath_Tet.amount++;
				EnchantmentItem.Reblath_Tri.amount--;

				if (!pitySuccess) EnchantmentItem.Reblath_Tet.total_value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Tet.total_value += CONCENTRATED_MAGICAL_BLACKSTONE + EnchantmentItem.Reblath_Tri.total_value / EnchantmentItem.Reblath_Tri.total_amount;
				EnchantmentItem.Reblath_Tet.total_amount++;
				break;
			case EnchantmentItem.Reblath_Duo:
				EnchantmentItem.Reblath_Tri.value += CONCENTRATED_MAGICAL_BLACKSTONE;
				if (!pitySuccess) EnchantmentItem.Reblath_Tri.value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Tri.value += EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
				EnchantmentItem.Reblath_Duo.value -= EnchantmentItem.Reblath_Duo.value / EnchantmentItem.Reblath_Duo.amount;
				EnchantmentItem.Reblath_Tri.amount++;
				EnchantmentItem.Reblath_Duo.amount--;

				if (!pitySuccess) EnchantmentItem.Reblath_Tri.total_value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Tri.total_value += CONCENTRATED_MAGICAL_BLACKSTONE + EnchantmentItem.Reblath_Duo.total_value / EnchantmentItem.Reblath_Duo.total_amount;
				EnchantmentItem.Reblath_Tri.total_amount++;
				break;
			case EnchantmentItem.Reblath_Mon:
				EnchantmentItem.Reblath_Duo.value += CONCENTRATED_MAGICAL_BLACKSTONE;
				if (!pitySuccess) EnchantmentItem.Reblath_Duo.value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Duo.amount++;
				EnchantmentItem.Reblath_Mon.amount--;

				if (!pitySuccess) EnchantmentItem.Reblath_Duo.total_value += this.currentFailstack.value;
				EnchantmentItem.Reblath_Duo.total_value += CONCENTRATED_MAGICAL_BLACKSTONE;
				EnchantmentItem.Reblath_Duo.total_amount++;
				break;
			case EnchantmentItem.Blackstar_Tet:
				EnchantmentItem.Blackstar_Pen.value += FLAWLESS_MAGICAL_BLACKSTONE;
				if (!pitySuccess) EnchantmentItem.Blackstar_Pen.value += this.currentFailstack.value;
				EnchantmentItem.Blackstar_Pen.value += EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
				EnchantmentItem.Blackstar_Tet.value -= EnchantmentItem.Blackstar_Tet.value / EnchantmentItem.Blackstar_Tet.amount;
				EnchantmentItem.Blackstar_Pen.amount++;
				EnchantmentItem.Blackstar_Tet.amount--;
				break;
			case EnchantmentItem.Blackstar_Tri:
				EnchantmentItem.Blackstar_Tet.value += FLAWLESS_MAGICAL_BLACKSTONE;
				if (!pitySuccess) EnchantmentItem.Blackstar_Tet.value += this.currentFailstack.value;
				EnchantmentItem.Blackstar_Tet.value += EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
				EnchantmentItem.Blackstar_Tri.value -= EnchantmentItem.Blackstar_Tri.value / EnchantmentItem.Blackstar_Tri.amount;
				EnchantmentItem.Blackstar_Tet.amount++;
				EnchantmentItem.Blackstar_Tri.amount--;
				break;
			case EnchantmentItem.Blackstar_Duo:
				EnchantmentItem.Blackstar_Tri.value += FLAWLESS_MAGICAL_BLACKSTONE;
				if (!pitySuccess) EnchantmentItem.Blackstar_Tri.value += this.currentFailstack.value;
				EnchantmentItem.Blackstar_Tri.value += EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
				EnchantmentItem.Blackstar_Duo.value -= EnchantmentItem.Blackstar_Duo.value / EnchantmentItem.Blackstar_Duo.amount;
				EnchantmentItem.Blackstar_Tri.amount++;
				EnchantmentItem.Blackstar_Duo.amount--;
				break;
			case EnchantmentItem.Blackstar_Mon:
				EnchantmentItem.Blackstar_Duo.value += FLAWLESS_MAGICAL_BLACKSTONE;
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
		this.price += CONCENTRATED_MAGICAL_BLACKSTONE;
		const pity = esItem.pity;
		const applyPity = pity.check();

		let message;
		if (applyPity) {
			message = `${esItem.name} successful because pity got applied`;
			this.increaseItem(esItem, true);
			this.insertFs();
			pity.reset();
		} else {
			const roll: number = Math.random() * 100; // this.rand.nextFloat() * 100;
			const uppBaseChance = esItem.base_chance;
			const uppFS = this.currentFailstack.tier + this.controller.getFamilyFS().value();
			const uppChance = uppBaseChance + (uppFS * uppBaseChance) / 10;

			if (roll < uppChance) {
				message = `${esItem.name} successful with ${this.currentFailstack.tier} because ${nf(roll, 2)} < ${nf(uppChance, 2)}`;
				this.increaseItem(esItem);
				this.deleteFs();
				pity.reset();
			} else {
				message = `${esItem.name} failed with ${this.currentFailstack.tier} because ${nf(roll, 2)} > ${nf(uppChance, 2)} ${pity.current}/${pity.max} pity stacks`;
				this.increaseFs(esItem);
				this.decreaseItem(esItem);
				this.insertFs();
				this.deleteFs();
				pity.increase();
			}
		}

		this.controller.getLastClick().value(message);

		const endFS = this.controller.getEnchantmentStep(this.controller.getEnchantmentStepsSize() - 1)!.endFS.value() - this.controller.getFamilyFS().value();
		const targetAmount = this.controller.getTargetAmount().value();
		if (this.failstacks.get(endFS)!.amount == targetAmount) {
			this.upgrading = false;
		}
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

			// if (enchantmentStep.endFS.value() > 0) {
			// 	this.choosenStep = new EnchantmentStep(es_index, this.controller);
			// }

			if (
				(esItem == EnchantmentItem.Reblath_Tet && EnchantmentItem.Reblath_Tet.amount > 0) ||
				(esItem == EnchantmentItem.Reblath_Tri && EnchantmentItem.Reblath_Tri.amount > 0) ||
				(esItem == EnchantmentItem.Blackstar_Tet && EnchantmentItem.Blackstar_Tet.amount > 0) ||
				(esItem == EnchantmentItem.Blackstar_Tri && EnchantmentItem.Blackstar_Tri.amount > 0) ||
				(esItem == EnchantmentItem.Blackstar_Duo && EnchantmentItem.Blackstar_Duo.amount > 0)
			) {
				for (let j = esEndFS - 1; j >= esStartFS; j--) {
					if (this.failstacks.get(j)!.amount > 0) {
						this.takeFs(j);
						fsFound = true;
						break;
					}
				}
			} else if (esItem == EnchantmentItem.Reblath_Duo && EnchantmentItem.Reblath_Duo.amount > 0) {
				for (let j = esEndFS - 1; j >= esStartFS; j--) {
					if (j == esStartFS && this.failstacks.get(j)!.amount == 0 && esStartFS <= 30) {
						this.failstacks.get(30)!.amount++;
						this.failstacks.get(30)!.value += BUY_FS_30;
						this.price += BUY_FS_30;
						j = 30;
					}
					if (j >= esStartFS && this.failstacks.get(j)!.amount > 0) {
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
					if (j == esStartFS && this.failstacks.get(j)!.amount == 0) {
						if (esStartFS == 5) {
							this.failstacks.get(5)!.amount++;
							this.failstacks.get(5)!.value += BUY_FS_5;
							this.price += BUY_FS_5;
						}
						if (esStartFS == 10) {
							this.failstacks.get(10)!.amount++;
							this.failstacks.get(10)!.value += BUY_FS_10;
							this.price += BUY_FS_10;
						}
						if (esStartFS == 15) {
							this.failstacks.get(15)!.amount++;
							this.failstacks.get(15)!.value += BUY_FS_15;
							this.price += BUY_FS_15;
						}
						if (esStartFS == 20) {
							this.failstacks.get(20)!.amount++;
							this.failstacks.get(20)!.value += BUY_FS_20;
							this.price += BUY_FS_20;
						}
						if (esStartFS == 25) {
							this.failstacks.get(25)!.amount++;
							this.failstacks.get(25)!.value += BUY_FS_25;
							this.price += BUY_FS_25;
						}
						if (esStartFS == 30) {
							this.failstacks.get(30)!.amount++;
							this.failstacks.get(30)!.value += BUY_FS_30;
							this.price += BUY_FS_30;
						}
					}
					if (j >= esStartFS && this.failstacks.get(j)!.amount > 0) {
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
	enchantmentItem_Pity_Current_OnChange(ei_index: number, oldPityCurrent: number, newPityCurrent: number) {
		const enchantment_item = this.controller.getEnchantmentItem(ei_index);
		if (!enchantment_item) return Logger.warn(`There are no ${ei_index + 1} Reblaths`);

		Logger.debug(`The Current Pity Stack of Reblath(${ei_index}) has changed(${oldPityCurrent} => ${newPityCurrent})`);
	}
	/* Unused */
	enchantmentItem_Pity_Max_OnChange(ei_index: number, oldPityMax: number, newPityMax: number) {
		const enchantment_item = this.controller.getEnchantmentItem(ei_index);
		if (!enchantment_item) return Logger.warn(`There are no ${ei_index + 1} Reblaths`);

		Logger.debug(`The Max Pity Stack of Reblath(${ei_index}) has changed(${oldPityMax} => ${newPityMax})`);
	}
	/* Unused */
	enchantmentItem_Amount_OnChange(ei_index: number, oldAmount: number, newAmount: number) {
		const enchantment_item = this.controller.getEnchantmentItem(ei_index);
		if (!enchantment_item) return Logger.warn(`There are no ${ei_index + 1} Reblaths`);

		Logger.debug(`The Amount of Reblath(${ei_index}) has changed(${oldAmount} => ${newAmount})`);
	}
	/* Unused */
	enchantmentItem_WorthEach_OnChange(ei_index: number, oldWorthEach: number, newWorthEach: number) {
		const enchantment_item = this.controller.getEnchantmentItem(ei_index);
		if (!enchantment_item) return Logger.warn(`There are no ${ei_index + 1} Reblaths`);

		Logger.debug(`The Worth of each Reblath(${ei_index}) has changed(${oldWorthEach} => ${newWorthEach})`);
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

		const step = this.controller.getEnchantmentStep(0);
		if (!step) return Logger.warn('There are no Enchantment Steps');

		step.startFS.value(newFamilyFS + this.controller.getBuyFS().value());
	}
	buyFS_OnChange(oldBuyFS: number, newBuyFS: number) {
		Logger.debug(`The Buy FS has changed(${oldBuyFS} => ${newBuyFS})`);

		const enchantment_step = this.controller.getEnchantmentStep(0);
		if (!enchantment_step) return Logger.warn('There are no Enchantment Steps');

		enchantment_step.startFS.value(this.controller.getFamilyFS().value() + newBuyFS);
	}
	/* Unused */
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

	/* Unused */
	lastClick_OnChange(oldLastClick: string, newLastClick: string) {
		Logger.debug(`The Last Click has changed(${oldLastClick} => ${newLastClick})`);
	}
	/* Unused */
	stacksCrafted_OnChange(oldStacksCrafted: string, newStacksCrafted: string) {
		Logger.debug(`The Stacks Crafted has changed(${oldStacksCrafted} => ${newStacksCrafted})`);
	}
}
