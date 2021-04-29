import React, { Fragment } from 'react';
import { Route, Link } from "react-router-dom";
import Logo from "./Logo.png";

const Footer = () => {
    return (
        <Fragment>
            <footer class="footer">
            <div class="footer-left col-md-4 col-sm-6">
                <p class="about">
                <h5>About the company</h5><strong>StealYourCeleb</strong> is aimed to bring together fashions followed by celebrity on a single platform making it easier for their fans to copy their style. StealYourCeleb enable fans to find the accessories which their icons use and let them buy those accessories. StillYourCeleb has bidding/auction for the high demand accessory,  so that it is only available to the craziest fan.

                </p>
                
            </div>
            <div class="footer-center col-md-4 col-sm-6">
                <div class="icons">
                    <a href="#"><i class="fa fa-facebook"></i></a>
                    <a href="#"><i class="fa fa-twitter"></i></a>
                    <a href="#"><i class="fa fa-instagram"></i></a>
                    </div>
            </div>
            <div class="footer-right col-md-4 col-sm-6">
                <Link to='/'>
                <img src={Logo} />
                </Link>
               
                
            </div>
            </footer>
            <footer className="py-1">
                <p className="text-center mt-1">
                    StealYourCeleb - 2021, All Rights Reserved
                </p>
            </footer>
        </Fragment>
    )
}

export default Footer
