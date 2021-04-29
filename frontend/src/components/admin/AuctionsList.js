import React, { Fragment, useEffect, useState } from "react";

import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import axios from "axios";

const AuctionsList = ({ history }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAdminAuctions = async () => {
    const { data } = await axios.get(`/api/v1/admin/auctions/getAllAuctions`);
    setAuctions(data.auctions);
    setLoading(false);
  };
  useEffect(() => {
    getAdminAuctions();
  }, []);

  const setupAuctions = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Item Name",
          field: "itemName",
          sort: "asc",
        },

        {
          label: "Total Bids",
          field: "totalbids",
          sort: "asc",
        },
      ],
      rows: [],
    };

    auctions.forEach((auction) => {
      data.rows.push({
        id: auction._id,
        itemName: auction.itemName,
        totalbids: auction.bids.length,
      });
    });

    return data;
  };

  return (
    <Fragment>
      <MetaData title={"All Products"} />
      <div className='row'>
        <div className='col-12 col-md-2'>
          <Sidebar />
        </div>

        <div className='col-12 col-md-10'>
          <Fragment>
            <h1 className='my-5'>All Auctions</h1>

            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setupAuctions()}
                className='px-3'
                bordered
                striped
                hover
              />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default AuctionsList;
