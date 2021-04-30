import React, { Fragment, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { Carousel } from "react-bootstrap";
import "rc-slider/assets/index.css";

import MetaData from "./layout/MetaData";
import Product from "./product/Product";
import Loader from "./layout/Loader";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { getProducts } from "../actions/productActions";

import axios from "axios";

const CelebrityProducts = ({ match }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [celebrityDetails, setCelebrityDetails] = useState(null);

  const fetchCelebrity = async (id) => {
    const { data } = await axios.get(
      `/api/v1/celebrities/singleCelebrity?id=${id}`
    );

    setCelebrityDetails(data.celebrity);
  };

  const alert = useAlert();
  const dispatch = useDispatch();

  const {
    loading,
    products,
    error,
    productsCount,
    resPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const keyword = match.params.keyword;
  const celebrity = match.params.id;
  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    fetchCelebrity(celebrity);
    console.log("match", match);
    console.log("celebiry", celebrity);
    dispatch(
      getProducts(keyword, currentPage, price, category, rating, celebrity)
    );
  }, [
    dispatch,
    alert,
    error,
    keyword,
    currentPage,
    price,
    category,
    rating,
    celebrity,
  ]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  let count = productsCount;
  if (keyword) {
    count = filteredProductsCount;
  }

  return (
    <Fragment>
      {loading || celebrityDetails === null ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />

         

          <section id='products' className='container'>
            <div className='row'>
              <div className='col-12 img-fluid' id='product_image'>
                <Carousel pause='hover'>
                  {celebrityDetails.images &&
                    celebrityDetails.images.map((image) => (
                      <Carousel.Item key={image.public_id}>
                        <img
                          className='d-block w-100'
                          src={image.url}
                          
                          alt={celebrityDetails.name}
                        />
                      </Carousel.Item>
                    ))}
                </Carousel>
              </div>
            </div>
          </section>

          <h1 id='products_heading'>Latest Products</h1>

          <section id='products' className='container mt-5'>
            <div className='row'>
              {products.map((product) => (
                <Product key={product._id} product={product} col={3} />
              ))}
            </div>
          </section>

          {resPerPage <= count && (
            <div className='d-flex justify-content-center mt-5'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass='page-item'
                linkClass='page-link'
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default CelebrityProducts;
