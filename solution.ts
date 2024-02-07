
interface PricingRule {
    sku: string;
    price: number;
    specialDeal?: {
        quantity: number;
        discountedQuantity: number;
    };
    bulkDiscount?: {
        threshold: number;
        discountedPrice: number;
    };
}

const pricingRules: PricingRule[] = [
    { sku: "ipd", price: 549.99, bulkDiscount: { threshold: 4, discountedPrice: 499.99 } },
    { sku: "mbp", price: 1399.99 },
    { sku: "atv", price: 109.50, specialDeal: { quantity: 3, discountedQuantity: 2 } },
    { sku: "vga", price: 30.00 },
];

class Checkout {
    private pricingRules: PricingRule[];
    private scannedItems: string[];

    constructor(pricingRules: PricingRule[]) {
        this.pricingRules = pricingRules;
        this.scannedItems = [];
    }

    scan(item: string): void {
        this.scannedItems.push(item);
    }

    total(): number {
        const itemCounts: Record<string, number> = {};
        this.scannedItems.forEach((item) => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        });

        let total = 0;
        console.log(itemCounts)
        this.pricingRules.forEach((rule) => {
            const count = itemCounts[rule.sku] || 0;

            if (rule.specialDeal && count >= rule.specialDeal.quantity) {
                const discountedCount = Math.floor(count / rule.specialDeal.quantity) * rule.specialDeal.discountedQuantity;
                total += discountedCount * rule.price;

            } else if (rule.bulkDiscount && count >= rule.bulkDiscount.threshold) {
                total += count * rule.bulkDiscount.discountedPrice;
            } else {
                total += count * rule.price;
            }
        });

        return total;
    }
}



const co = new Checkout(pricingRules);



// Uncomment the below scenarios one after the other,

//// Scenario 1
// co.scan("atv");
// co.scan("atv");
// co.scan("atv");
// co.scan("vga");
// console.log("Total expected: $" + co.total()); // Output: $249.00

//// Scenario 2

// co.scan("atv");
// co.scan("ipd");
// co.scan("ipd");
// co.scan("atv");
// co.scan("ipd");
// co.scan("ipd");
// co.scan("ipd");
// console.log("Total expected: $" + co.total()); // Output: $2718.95
