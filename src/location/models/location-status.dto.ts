export type LocationStatus =
    | 1 // Starting Up
    | 2 // Open
    | 3 // No New Orders
    | 4 // Closing Down
    | 5; // Closed

export class LocationStatusResponse {
    locationId: string;
    value: LocationStatus;
    description: string;
}
