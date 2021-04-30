import React from 'react';
import { Carousel } from 'react-bootstrap';

import image1 from '../../../src/assets/image1.jpg';
import image2 from '../../../src/assets/salmankhanbanner.jpg';
import image3 from '../../../src/assets/sonamkapoorbanner.jpg';
import image4 from '../../../src/assets/bidbanner.jpg';

const CarouselContainer = () => {
  return (
    <Carousel fade={true} pause={false}>
      <Carousel.Item interval={2000}>
        <img
          className="widthheight"
          src={image1}
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Welcome to StealYourCeleb</h3>
          <p>Find Your Favorite Celeb Products here</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          className="widthheight" 
          src={image2}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Welcome to StealYourCeleb</h3>
          <p>Copy style of your favorite celebrity</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          className="widthheight"
          src={image3}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Welcome to StealYourCeleb</h3>
          <p>We love to bring celebrity products to you</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          className="widthheight"
          src={image4}
          alt="Fourth slide"
        />
        <Carousel.Caption>
          <h3>Welcome to StealYourCeleb</h3>
          <p>How about participating in bidding?</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}

export default CarouselContainer;