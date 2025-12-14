export interface IOrderItem {
  menuId: string;
  quantity: number;
}

export interface IPriceProvider {
  getPrice(menuId: string): Promise<number | null>;
}

export interface IOrderResult {
  totalPrice: number;
  itemsProcessed: number;
  errors: string[];
}

export class OrderProcessor {
  private priceProvider: IPriceProvider;

  constructor(provider: IPriceProvider) {
    this.priceProvider = provider;
  }

  public async processOrder(items: IOrderItem[]): Promise<IOrderResult> {
    let total = 0;
    const errors: string[] = [];
    let count = 0;

    for (const item of items) {
      if (item.quantity <= 0) {
        errors.push(`Item ${item.menuId} has invalid quantity`);
        continue;
      }

      const price = await this.priceProvider.getPrice(item.menuId);

      if (price === null) {
        errors.push(`Item ${item.menuId} not found in menu`);
      } else {
        total += price * item.quantity;
        count++;
      }
    }

    return {
      totalPrice: total,
      itemsProcessed: count,
      errors,
    };
  }
}
