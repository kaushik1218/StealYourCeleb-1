import React, { Fragment, useState, useEffect } from "react";

import "rc-slider/assets/index.css";

import MetaData from "./layout/MetaData";
import Auction from "./auctions/Auctions";
import Loader from "./layout/Loader";
import axios from "axios";
const AllAuctions = ({ match }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState([]);
  const getAucions = async () => {
    try {
      const { data } = await axios.get(`/api/v1/auctions`);

      setAuctions(data.auctions);
      setLoading(false);
    } catch (error) {
      setLoading(true);
      console.log("error", error.response);
    }
  };
  useEffect(() => {
    getAucions();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />

          <h1 id='products_heading'>All Auctions</h1>

          <section id='products' className='container mt-5'>
            <div className='row'>
              {auctions.map((auction) => (
                <Auction key={auction._id} auction={auction} col={3} />
              ))}
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default AllAuctions;
