import { IDeliveryResponse } from "../contracts/deliveries.contracts";
import axios from "axios";
import moment from "moment";

export async function getDeliveriesFromAPI(date: string): Promise<IDeliveryResponse[]> {
    return axios(process.env.DELIVERIES_API_URL! + `?date=${date}`)
        .then(res => res.data)
}

export function getDates(startDate: string, endDate: string) {
    const dates: string[] = [];

    while (moment(startDate) <= moment(endDate)) {
        dates.push(startDate);
        startDate = moment(startDate).add(1, 'day').format('YYYY-MM-DD');
    }

    return dates;
}
