import React, { Fragment, useEffect } from 'react'

import MetaData from '../layout/MetaData'


import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder, clearErrors } from '../../actions/orderActions'

import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement,Elements } from '@stripe/react-stripe-js'

import axios from 'axios'

const options = {
    style: {
        base: {
            fontSize: '16px'
        },
        invalid: {
            color: '#9e2146'
        }
    }
}

const Payment = ({ history }) => {

    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth)
    
    

    useEffect(() => {

    }, [dispatch, alert])


    const bidPayment=localStorage.getItem('bid-pay');
    const orderId=localStorage.getItem('order-id');

    const submitHandler = async (e) => {
        e.preventDefault();

        document.querySelector('#pay_btn').disabled = true;

        let res;
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            
            const paymentData = {
        
                amount: Math.round(bidPayment * 100)
            }
            console.log('paymentData',paymentData)
            res = await axios.post('/api/v1/payment/process', paymentData, config)

            const clientSecret = res.data.client_secret;

            console.log(clientSecret);

            if (!stripe || !elements) {
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });

            if (result.error) {
                alert.error(result.error.message);
                document.querySelector('#pay_btn').disabled = false;
            } else {

                // The payment is processed or not
                if (result.paymentIntent.status === 'succeeded') {

                    
                    
                    try {
                        const auctionData={
                            id:orderId
                        }
                        const config = {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        };
                
                        const { data } = await axios.post(
                          `/api/v1/auctions/winner-payment`,
                          auctionData,
                          config
                        );
                        localStorage.removeItem('bid-pay')

                    localStorage.removeItem('order-id')
                        alert.success("Paid successfully");
                        history.push('/orders/me')
                        
                      } catch (error) {
                        alert.error("Server Error");
                      }
                    

                } else {
                    alert.error('There is some issue while payment processing')
                }
            }


        } catch (error) {
            document.querySelector('#pay_btn').disabled = false;
            alert.error(error.response.data.message)
        }
    }

    return (
        <Fragment>
            <MetaData title={'Payment'} />

            

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>

                        <h1 className="mb-4">Card Info</h1>
                        <div className="form-group">
                            <label htmlFor="card_num_field">Card Number</label>
                            <CardNumberElement
                                type="text"
                                id="card_num_field"
                                className="form-control"
                                options={options}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_exp_field">Card Expiry</label>
                            <CardExpiryElement
                                type="text"
                                id="card_exp_field"
                                className="form-control"
                                options={options}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_cvc_field">Card CVC</label>
                            <CardCvcElement
                                type="text"
                                id="card_cvc_field"
                                className="form-control"
                                options={options}
                            />
                        </div>


                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            Pay 
                        </button>

                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Payment
