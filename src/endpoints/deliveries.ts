import express, { Request, Response } from "express";
import StatusCodes from 'http-status-codes';
import { query, validationResult } from 'express-validator';
import _ from 'lodash';
import moment from 'moment';
import { IStoreAverages } from "../contracts/deliveries.contracts";
import { getDates, getDeliveriesFromAPI } from "../utils/utils";

const timeFormat = 'YYYY-MM-DD';

export const deliveriesRouter = express.Router();

deliveriesRouter.get('/deliveryAverages',
    query('startDate', `startDate should have a format ${timeFormat}`).isDate({ format: timeFormat }),
    query('endDate', `endDate should have a format ${timeFormat}`).isDate({ format: timeFormat }),
    async(request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }
        const { startDate, endDate } = request.query as any;
        if (startDate > moment().format(timeFormat) && endDate > moment().format(timeFormat)) {
            return response.status(StatusCodes.BAD_REQUEST).send('Dates should be less than or equal today');
        }

        const dates = getDates(startDate, endDate);

        const deliveriesRaw = await Promise.all(dates.map(async date => await getDeliveriesFromAPI(date)));
        const deliveriesUnique = _.uniqBy(deliveriesRaw.flatMap(x => x), 'orderId');
        const deliveries = Object.values(_.groupBy(deliveriesUnique, (data) => data.storeId));

        const storeAverages: IStoreAverages[] = deliveries.map(data => {
            const deliveriesCount = data.length;
            return {
                storeId: data[0].storeId,
                deliveries: deliveriesCount,
                averageSeconds: Math.round(_.sumBy(data, (el) => el.seconds) / deliveriesCount)
            };
        });

        return response.json({ timePeriod: [startDate, endDate], storeAverages });
});
