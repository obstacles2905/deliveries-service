import supertest = require("supertest");
import StatusCodes from 'http-status-codes';
import moment from 'moment';

import { app } from "../server";
import { getDates, getDeliveriesFromAPI } from "../src/utils/utils";

const server = app.listen();
const request = supertest.agent(server);

describe('Deliveries endpoints', () => {
    afterAll(() => {
        server.close();
    });

    describe('GET /deliveryAverages', () => {
       it('Should correctly calculate deliveries', async() => {
           const startDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
           const endDate = moment().format('YYYY-MM-DD');

           const { body, status } = await request.get('/deliveryAverages').query({startDate, endDate});

           expect(status).toEqual(StatusCodes.OK);
           expect(body.timePeriod).toEqual([startDate, endDate]);
           expect(body.storeAverages.length).toBeGreaterThanOrEqual(0);
       });

        it('Should throw bad request if dates are missing', async() => {
            const response = await request.get('/deliveryAverages');

            expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors[0].msg).toEqual('startDate should have a format YYYY-MM-DD');
        });

        it('Should throw bad request if both dates are in future', async() => {
            const startDate = moment().add(1, 'day').format('YYYY-MM-DD');
            const endDate = moment().add(2, 'day').format('YYYY-MM-DD');
            const response = await request.get('/deliveryAverages').query({startDate, endDate});

            expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
            expect(response.text).toEqual('Dates should be less than or equal today');
        })
    });

    describe('Utils', () => {
        describe('getDeliveriesFromAPI', () => {
            it('Should correctly return data from a Deliveries API', async() => {
                const today = moment().format('YYYY-MM-DD');
                const response = await getDeliveriesFromAPI(today);

                expect(response).toHaveProperty('length');
            });

            it('Should throw an error for a date in future', async() => {
                const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');

                await expect(await getDeliveriesFromAPI(tomorrow)).rejects;
            })
        });

        describe('getDates', () => {
            it('Should return all dates for a listed interval', () => {
                const startDate = '2022-09-15';
                const endDate = '2022-09-20';

                const result = getDates(startDate, endDate);
                expect(result).toHaveLength(6);
            });

            it('Should correctly handle one-date interval', () => {
                const startDate = '2022-09-20';
                const endDate = '2022-09-20';

                const result = getDates(startDate, endDate);
                expect(result).toHaveLength(1);
            })
        })
    });
});