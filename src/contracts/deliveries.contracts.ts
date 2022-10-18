export interface IDeliveryResponse {
    orderId: number;
    storeId: number;
    date: string;
    seconds: number;
}

export interface IStoreAverages {
    storeId: number;
    deliveries: number;
    averageSeconds: number;
}