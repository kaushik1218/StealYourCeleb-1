import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { myOrders, clearErrors } from "../../actions/orderActions";

const ListOrders = ({history}) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders, bidWins } = useSelector(
    (state) => state.myOrders
  );
  console.log("bidWins", bidWins);
  useEffect(() => {
    dispatch(myOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Num of Items",
          field: "numOfItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    orders.forEach((order) => {
      data.rows.push({
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        status:
          order.orderStatus &&
          String(order.orderStatus).includes("Delivered") ? (
            <p style={{ color: "green" }}>{order.orderStatus}</p>
          ) : (
            <p style={{ color: "red" }}>{order.orderStatus}</p>
          ),
        actions: (
          <Link to={`/order/${order._id}`} className='btn btn-primary'>
            <i className='fa fa-eye'></i>
          </Link>
        ),
      });
    });

    return data;
  };

  const getHeighestBid = (bids) => {
    let heighestBid = 0;
    bids.forEach((bid) => {
      if (bid.bid > heighestBid) {
        heighestBid = bid.bid;
      }
    });
    return heighestBid;
  };

  const setBidWins = () => {
    let data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Item Name",
          field: "itemName",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },

        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };
    if (bidWins) {
      bidWins.forEach((order) => {
        data.rows.push({
          id: order._id,
          itemName: order.itemName,
          amount: "$" + getHeighestBid(order.bids),

          actions: order.isPaid ? (
            <p style={{ color: "green" }}>Already Paid</p>
          ) : (
            <button className='btn btn-primary' onClick={e=>{
              e.preventDefault();
              localStorage.setItem('bid-pay',getHeighestBid(order.bids))
              localStorage.setItem('order-id',order._id)
              history.push('/bid-payment')
            }}>
              Pay $ {getHeighestBid(order.bids)}
            </button>
          ),
        });
      });
    }
    return data;
  };

  return (
    <Fragment>
      <MetaData title={"My Orders"} />

      <h1 className='my-5'>My Orders</h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          <MDBDataTable
            data={setOrders()}
            className='px-3'
            bordered
            striped
            hover
          />
          <h1 className='my-5'>My Bid Wins</h1>
          <MDBDataTable
            data={setBidWins()}
            className='px-3'
            bordered
            striped
            hover
          />
        </>
      )}
    </Fragment>
  );
};

export default ListOrders;
