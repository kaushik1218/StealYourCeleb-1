import React, { Fragment, useState } from "react";

import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { useAlert } from "react-alert";
import axios from "axios";

const getDateString = (date) => {
  let year = date.getFullYear();
  let day =
    date.getDate().toString().length === 1
      ? "0" + date.getDate()
      : date.getDate();
  let month =
    date.getMonth().toString().length === 1
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let hours =
    date.getHours().toString().length === 1
      ? "0" + date.getHours()
      : date.getHours();
  let minutes =
    date.getMinutes().toString().length === 1
      ? "0" + date.getMinutes()
      : date.getMinutes();
  let dateString = `${year}-${month}-${day}T${hours}:${minutes}`;
  return dateString;
};
const NewAuction = ({ history }) => {
  const currentDate = new Date();
  const defaultStartTime = getDateString(currentDate);
  const defaultEndTime = getDateString(
    new Date(currentDate.setHours(currentDate.getHours() + 1))
  );
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [values, setValues] = useState({
    itemName: "",
    description: "",
    image: "",
    bidStart: defaultStartTime,
    bidEnd: defaultEndTime,
    startingBid: 0,
    redirect: false,
    error: "",
  });
  const alert = useAlert();
  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = async (e) => {
    e.preventDefault();
    if (values.bidEnd < values.bidStart) {
      setValues({ ...values, error: "Auction cannot end before it starts" });
    } else {
      let auctionData = new FormData();
      auctionData.set("itemName", values.itemName);

      auctionData.set("description", values.description);
      auctionData.set("images", images);

      auctionData.set("startingBid", values.startingBid);
      auctionData.set("bidStart", values.bidStart);
      auctionData.set("bidEnd", values.bidEnd);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const { data } = await axios.post(
          `/api/v1/admin/auctions/createAuction`,
          auctionData,
          config
        );
        alert.success("Auction created successfully");
        history.push("/admin/auctions");
      } catch (error) {
        alert.error("Server Error");
      }
    }
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title={"New Product"} />
      <div className='row'>
        <div className='col-12 col-md-2'>
          <Sidebar />
        </div>

        <div className='col-12 col-md-10'>
          <Fragment>
            <div className='wrapper my-5'>
              <form
                className='shadow-lg'
                onSubmit={clickSubmit}
                encType='multipart/form-data'
              >
                <h1 className='mb-4'>New Auction</h1>

                <div className='form-group'>
                  <label htmlFor='name_field'>Item Name</label>
                  <input
                    type='text'
                    id='name_field'
                    className='form-control'
                    value={values.itemName}
                    onChange={handleChange("itemName")}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='starting_bid_field'>Starting Bid</label>
                  <input
                    type='text'
                    id='starting_bid_field'
                    className='form-control'
                    value={values.startingBid}
                    onChange={handleChange("startingBid")}
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='description_field'>Description</label>
                  <textarea
                    className='form-control'
                    id='description_field'
                    rows='8'
                    value={values.description}
                    onChange={handleChange("description")}
                  ></textarea>
                </div>

                <div className='form-group'>
                  <label htmlFor='datetime-local'>Bid Start Time</label>
                  <input
                    type='datetime-local'
                    id='datetime-local'
                    className='form-control'
                    value={values.bidStart}
                    onChange={handleChange("bidStart")}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='datetime-local'>Bid End Time</label>
                  <input
                    type='datetime-local'
                    id='datetime-local'
                    className='form-control'
                    value={values.bidEnd}
                    onChange={handleChange("bidEnd")}
                  />
                </div>

                <div className='form-group'>
                  <label>Images</label>

                  <div className='custom-file'>
                    <input
                      type='file'
                      name='product_images'
                      className='custom-file-input'
                      id='customFile'
                      onChange={onChange}
                      multiple
                    />
                    <label className='custom-file-label' htmlFor='customFile'>
                      Choose Images
                    </label>
                  </div>

                  {imagesPreview.map((img) => (
                    <img
                      src={img}
                      key={img}
                      alt='Images Preview'
                      className='mt-3 mr-2'
                      width='55'
                      height='52'
                    />
                  ))}
                </div>

                <button
                  id='login_button'
                  type='submit'
                  className='btn btn-block py-3'
                  disabled={loading ? true : false}
                >
                  CREATE
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};
export default NewAuction;
