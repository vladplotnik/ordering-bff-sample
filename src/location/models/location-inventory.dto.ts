export class LocationInventoryItem {
    sku: string;
    name: string;
    isAvailable: boolean;
}

export class LocationInventory {
    items: LocationInventoryItem[];
}
