export class Promotion {
    id: number;
    active: boolean;
    currency: string;
    date_created: Date;
    date_end: Date;
    date_start: Date;
    date_updated: Date;
    description: string;
    discounts: Discount[];
    limit_account_uses: number;
    limit_uses: number;
    use_count: number;
}

export class Discount {
    type: string;
    value_type: string;
    value_fixed: number;
}
