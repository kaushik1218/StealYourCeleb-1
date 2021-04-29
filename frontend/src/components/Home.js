import React, { Fragment, useState, useEffect } from "react";
import { Carousel } from 'react-bootstrap'
import "rc-slider/assets/index.css";

import MetaData from "./layout/MetaData";
import Celebrity from "./celebrity/Celebrity";
import Loader from "./layout/Loader";
import axios from "axios";
import "../App.css";
import CarouselContainer from '../components/celebrity/CarouselContainer';

const Home = ({ match }) => {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState([]);
  const getCelebrities = async () => {
    try {
      const { data } = await axios.get(`/api/v1/celebrities`);
      console.log(data);
      setCelebrities(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(true);
      console.log("error", error.response);
    }
  };
  useEffect(() => {
    getCelebrities();
  }, []);



  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />
          <div className="App1">
      <CarouselContainer />
    </div>
          <h1 id='products_heading'>All Celebrities</h1>
         
          <section id='products' className='container mt-5'>
          
            <div className='row'>
              {celebrities.map((celebrity) => (
                <Celebrity key={celebrity._id} celebrity={celebrity} col={3} />
              ))}
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
