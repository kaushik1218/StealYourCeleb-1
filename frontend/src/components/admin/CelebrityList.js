import React, { Fragment, useEffect, useState } from "react";

import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import { useAlert } from "react-alert";
import axios from "axios";
import { useDispatch } from "react-redux";

const CelebrityList = ({ history }) => {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const alert = useAlert();
  const getAdminCelebrities = async () => {
    const { data } = await axios.get(`/api/v1/admin/celebrities`);
    setCelebrities(data.data);
    setLoading(false);
  };
  useEffect(() => {
    getAdminCelebrities();
  }, []);
  const deleteCelebrityHandle = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/v1/admin/celebrity/deleteCelebrity?id=${id}`,
        config
      );

      alert.success("Celebrity created successfully");
      getAdminCelebrities();
    } catch (error) {
      alert.error("Server Error");
    }
  };
  const setupCelebrities = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },

        {
          label: "Type",
          field: "type",
          sort: "asc",
        },

        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    celebrities.forEach((celebrity) => {
      data.rows.push({
        id: celebrity._id,
        name: celebrity.name,
        type: celebrity.type,

        actions: (
          <Fragment>
            <button
              className='btn btn-danger py-1 px-2 ml-2'
              onClick={() => deleteCelebrityHandle(celebrity._id)}
            >
              <i className='fa fa-trash'></i>
            </button>
          </Fragment>
        ),
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
            <h1 className='my-5'>All Celebrities</h1>

            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setupCelebrities()}
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

export default CelebrityList;
