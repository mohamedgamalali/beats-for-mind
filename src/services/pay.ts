import { Types, Document } from 'mongoose';
import Stripe from 'stripe';
import User, { user as userType } from '../models/user';
import Plan, { plan as planType } from '../models/plan';
import { config } from 'dotenv';
import httpError from '../helpers/httpError';
import Transaction from "../models/transactions";
const stripe = new Stripe('sk_test_51JLBojIUiHtAtSMpK5teNR2iqVC096qR0DTwuKCSSLhxhb0Ree1boxPlXqQ8wxwhpctyReyoFcepmpMa4w7vftcC00XyoVcd6t', {
    apiVersion: '2020-08-27'
});

export default class stripePay {
    private userId: Types.ObjectId;
    private token: string;
    private planId: Types.ObjectId;

    constructor(userId: Types.ObjectId, token: string, planId: Types.ObjectId) {
        this.userId = userId;
        this.token = token;
        this.planId = planId;
    }

    private async createCustomer() {
        try {
            let userInfo: object = {};
            const user: any = await User.findById(this.userId).select('-mobile -blocked -cart -wishList');
            switch (user?.method) {
                case 'local':
                    userInfo = {
                        name: user.local.name,
                        email: user.local.email,
                        source: this.token
                    };
                    break;
                case 'google':
                    userInfo = {
                        name: user.google.name,
                        email: user.google.email,
                        source: this.token
                    };
                    break;
                case 'facebook':
                    userInfo = {
                        name: user.facebook.name,
                        email: user.facebook.email,
                        source: this.token
                    };
                    break;
            }
            const newCustomer = await stripe.customers.create({ ...userInfo });
            user.stripeId = newCustomer.id;
            await user.save();
            return newCustomer;
        } catch (err) {
            if (!err.status) {
                err.status = 500;
                err.state = 0;
            }
            throw err;
        }

    }

    private async isCustomerEx() {
        try {
            let userInfo: object = {};
            const user = await User.findById(this.userId).select('stripeId');
            if (user?.stripeId) {
                const customer = await stripe.customers.retrieve(user.stripeId);
                if (customer) {
                    return customer;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (err) {
            if (!err.status) {
                err.status = 500;
                err.state = 0;
            }
            throw err;
        }
    }

    private async beforePay() {
        try {

            const user = await User.findById(this.userId).select('plan');
            console.log(user?.plan.subscription_id);

            if (user?.plan.subscription_id) {
                const isSubscriped = await beforePay.checkSubscription(user?.plan.subscription_id)

                if (isSubscriped) {
                    const err = new httpError(409, 1000, 'already in a plan');
                    throw err;
                }
            }


        } catch (err) {
            if (!err.status) {
                err.status = 500;
                err.state = 0;
            }
            throw err;
        }
    }

    async subscripe() {
        try {
            let subscription: any;
            await this.beforePay();

            let customer = await this.createCustomer();


            const plan = await Plan.findById(this.planId);

            if (!plan) {
                const err = new httpError(404, 5, 'plan not found')
                throw err;
            }
            const user = await User.findById(this.userId)

            if (plan.interval == 'day') {
                if (user?.gotOneTimePlan) {
                    const err = new httpError(409, 1001, `can't do one time plan more than once`)
                    throw err;
                }
            }

            try {
                subscription = await stripe.subscriptions.create({
                    customer: customer.id,
                    items: [
                        { price: plan.stripe_plan_id },
                    ],
                    cancel_at_period_end: plan.oneTime
                });


            } catch (err1) {

                await errorHandler(err1.raw);
            }

            if (user) {
                user.plan = {
                    plan: plan._id,
                    subscription_id: subscription.id
                }
                if (plan.interval == 'day') {
                    user.gotOneTimePlan = true;
                }
                user.downloadsPerDay = 3 ;
            }

            await user?.save();


            const transaction = new Transaction({
                user: user?._id,
                plan: plan._id,
                amount: plan.amount,
                stripe_subscription_id: subscription.id
            });

            await transaction.save();

            return subscription;



        } catch (err) {
            console.log(err);

            if (!err.status) {
                err.status = 500;
                err.state = 0;
            }
            throw err;
        }
    }



}


export class beforePay {

    static async createPlans() {
        try {
            let plans = await Plan.find();
            let firstPlan = false;
            let secondPlan = false;
            let therdPlan = false;
            plans.forEach(p => {
                if (p.interval == 'day') {
                    firstPlan = true
                }
                else if (p.interval == 'month') {
                    secondPlan = true
                }
                else if (p.interval == 'year') {
                    therdPlan = true
                }
            })
            if (!firstPlan || !secondPlan || !therdPlan) {
                let plansArray = [];

                if (!firstPlan) {
                    plansArray.push({
                        amount: 1,
                        interval: 'day',
                        name: '3 days plan',
                        interval_count: 3,
                        oneTime: true
                    })
                }
                if (!secondPlan) {
                    plansArray.push({
                        amount: 19.99,
                        interval: 'month',
                        name: 'month plan',
                        interval_count: 1,
                        oneTime: false
                    })
                }
                if (!therdPlan) {
                    plansArray.push({
                        amount: 180,
                        interval: 'year',
                        name: 'year plan',
                        interval_count: 1,
                        oneTime: false
                    })
                }


                for (let i = 0; i < plansArray.length; i++) {
                    const product = await stripe.products.create({
                        name: plansArray[i].name,
                    });

                    const plan = await stripe.plans.create({
                        amount: <number>Number((plansArray[i].amount * 100).toFixed(2)),
                        currency: 'usd',
                        interval: <Stripe.PlanCreateParams.Interval>plansArray[i].interval,
                        interval_count: plansArray[i].interval_count,
                        product: product.id,
                    });

                    const newPlan = new Plan({
                        stripe_plan_id: plan.id,
                        name: plansArray[i].name,
                        amount: plansArray[i].amount,
                        interval: plansArray[i].interval,
                        interval_count: plansArray[i].interval_count,
                        oneTime: plansArray[i].oneTime
                    })

                    await newPlan.save();

                    plans.push(newPlan)
                }
            }

            return plans
        } catch (err) {
            if (!err.status) {
                err.status = 500;
                err.state = 0;
            }
            throw err;
        }
    }

    static async checkSubscription(subscription_id: string) {
        try {

            const subscription = await stripe.subscriptions.retrieve(
                subscription_id
            );


            if (subscription.status) {

                if (subscription.status == 'active') {
                    return true
                } else {
                    return false;
                }
            } else {
                return false;
            }


        } catch (err) {
            if (!err.status) {
                err.status = 500;
                err.state = 0;
            }
            throw err;
        }
    }
}


const errorHandler = async (body: any) => {
    try {

        let err: any;
        switch (body.type) {
            case 'StripeCardError':
                // A declined card error
                // => e.g. "Your card's expiration year is invalid."
                err = new httpError(402, 1002, body.message);
                throw err;
            case 'StripeRateLimitError':
                // Too many requests made to the API too quickly
                err = new httpError(402, 1003, 'Too many requests made to the API too quickly');
                throw err;
            case 'StripeInvalidRequestError':
                // Invalid parameters were supplied to Stripe's API
                err = new httpError(402, 1004, "Invalid parameters were supplied to Stripe's API");
                throw err;
            case 'StripeAPIError':
                // An error occurred internally with Stripe's API
                err = new httpError(402, 1005, "An error occurred internally with Stripe's API");
                throw err;
            case 'StripeConnectionError':
                // Some kind of error occurred during the HTTPS communication
                err = new httpError(402, 1006, "Some kind of error occurred during the HTTPS communication");
                throw err;
            case 'StripeAuthenticationError':
                // You probably used an incorrect API key
                err = new httpError(402, 1007, "You probably used an incorrect API key");
                throw err;
            default:
                // Handle any other types of unexpected errors
                err = new httpError(402, 1008, body.message);
                throw err;
        }

    } catch (err) {
        if (!err.status) {
            err.status = 500;
            err.state = 0;
        }
        throw err;
    }
}