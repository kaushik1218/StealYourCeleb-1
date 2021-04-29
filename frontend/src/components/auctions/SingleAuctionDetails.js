import React, { Fragment, useState, useEffect } from "react";

import "rc-slider/assets/index.css";
import { useAlert } from "react-alert";
import MetaData from "./../layout/MetaData";
import Loader from "./../layout/Loader";
import axios from "axios";
import moment from "moment";

const calculateTimeLeft = (date) => {
  let datee = new Date(date);
  const difference = datee - new Date();

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      timeEnd: false,
    };
  } else {
    timeLeft = { timeEnd: true };
  }
  return timeLeft;
};

const SingleAuctionList = ({ match }) => {
  const alert = useAlert();
  const handlPlaceBid = async (e) => {
    e.preventDefault();
    if (amount < auction.startingBid) {
      alert.error(
        "Minimum Bid Amount Must Be Greater Than Starting Bid Amount"
      );
      return false;
    }
    const formData = new FormData();
    formData.set("amount", amount);

    formData.set("id", auction._id);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `/api/v1/auctions/placeBid`,
        formData,
        config
      );
      alert.success("Your Bid Has Been Posted Succesfully");
      const id = match.params.id;
      getAucions(id);
      setAmount(0);
    } catch (error) {
      alert.error("Server Error");
    }
  };

  const currentDate = new Date();
  const showTimeLeft = (date) => {
    let timeLeft = calculateTimeLeft(date);

    return (
      !timeLeft.timeEnd && (
        <span>
          {timeLeft.days != 0 && `${timeLeft.days} d `}
          {timeLeft.hours != 0 && `${timeLeft.hours} h `}
          {timeLeft.minutes != 0 && `${timeLeft.minutes} m `}
          {timeLeft.seconds != 0 && `${timeLeft.seconds} s`} left
        </span>
      )
    );
  };

  const auctionState = (auction) => {
    return (
      <span>
        {currentDate < new Date(auction.bidStart) &&
          `Auction Starts at ${new Date(auction.bidStart).toLocaleString()}`}
        {currentDate > new Date(auction.bidStart) &&
          currentDate < new Date(auction.bidEnd) && (
            <>
              {`Auction is live | ${auction.bids.length} bids |`}{" "}
              {showTimeLeft(new Date(auction.bidEnd))}
            </>
          )}
        {currentDate > new Date(auction.bidEnd) &&
          `Auction Ended | ${auction.bids.length} bids `}
        {currentDate > new Date(auction.bidStart) &&
          auction.bids.length > 0 &&
          ` | Last bid: $ ${auction.bids[auction.bids.length - 1].bid}`}
      </span>
    );
  };

  const [auction, setAuction] = useState([]);
  const [loading, setLoading] = useState([]);
  const [amount, setAmount] = useState(0);
  const getAucions = async (id) => {
    try {
      const { data } = await axios.get(`/api/v1/auctions/details?id=${id}`);
      console.log("fisis", data);
      setAuction(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const id = match.params.id;
    getAucions(id);
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />

          <h1 id='products_heading'>Auction Details</h1>

          <section id='products' className='container mt-5'>
            <div className='row'>
              <div className='col-sm-12 col-md-6 col-lg-6 my-3 offset-md-3'>
                <div className='card p-3 rounded'>
                  <img
                    className='card-img-top mx-auto'
                    src={auction.images[0].url}
                  />
                  <div className='card-body d-flex flex-column'>
                    <h5 className='card-title text-center'>
                      {auction.itemName}
                    </h5>
                    <p>Start Time : {auctionState(auction)} </p>
                    <p>Time Left :{showTimeLeft(auction.bidEnd)} </p>
                    <p>Starting Bid Amount: {auction.startingBid}$ </p>
                  </div>
                </div>
              </div>
              <div className='col-sm-12 col-md-6 col-lg-6 my-3 offset-md-3'>
                <h5 className='card-title text-center'>Bidders</h5>

                <table className='table table-stripped'>
                  <tr>
                    <th>Bidder Name </th>
                    <th>Bid Amount </th>
                    <th>Bid Time </th>
                  </tr>
                  {auction.bids.map((bid) => {
                    return (
                      <tr>
                        <td>{bid.bidder.name}</td>
                        <td>{bid.bid}</td>
                        <td>
                          {moment().format("MMMM Do YYYY, h:mm:ss a", bid.time)}
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>

              <div className='col-sm-12 col-md-6 col-lg-6 my-3 offset-md-3'>
                <h4>Bid On This Auction</h4>
                {auction.winner !== null ||
                currentDate > new Date(auction.bidEnd) ? (
                  <>
                    <h4 style={{ color: "red" }}>Auction Closed</h4>
                  </>
                ) : (
                  <>
                    <form className='form-group'>
                      <div className='form-group'>
                        <label>Enter Amount</label>
                        <input
                          type='number'
                          className='form-control'
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value);
                          }}
                          placeholder='Enter Bid Amout'
                        />
                      </div>
                      <div className='form-group'>
                        <input
                          type='button'
                          onClick={handlPlaceBid}
                          className='btn btn-primary'
                          value='Submit Bid'
                        />
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default SingleAuctionList;
