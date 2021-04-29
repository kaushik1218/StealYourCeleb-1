const Auction = require("./../models/Auction");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("cloudinary");

// Create Auction   =>   /api/v1/auctions/createAuction
exports.createAuction = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  const auction = await Auction.create(req.body);

  res.status(200).json({
    success: true,
    auction,
  });
});

// get All Auctions
exports.getAllAuctions = catchAsyncErrors(async (req, res, next) => {
  const auctions = await Auction.find({});
  res.status(200).json({
    success: true,
    auctions,
  });
});

// get Single Auction
exports.getSingleAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.query;
  const auctions = await Auction.findById(id).populate(
    "bids.bidder",
    "_id name"
  );
  res.status(200).json({
    success: true,
    data: auctions,
  });
});

// Place Bid
exports.getSingleAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.query;
  const auctions = await Auction.findById(id).populate(
    "bids.bidder",
    "_id name"
  );
  res.status(200).json({
    success: true,
    data: auctions,
  });
});

exports.payForWinner = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.body;
   await Auction.findByIdAndUpdate(id,{
    isPaid:true
  })
  res.status(200).json({
    success: true,
    message:'Paid Successfully',
  });
});

exports.placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id, amount } = req.body;
  const user = req.user._id;
  const bid = {
    bidder: user,
    bid: amount,
  };
  await Auction.findByIdAndUpdate(id, {
    $push: { bids: bid },
  });
  res.status(200).json({
    success: true,
    message: "Your Bid Has Been Placed",
  });
});

exports.bidWinner = catchAsyncErrors(async (req, res, next) => {
  const auctions = await Auction.find({});
  for (let i = 0; i < auctions.length; i++) {
    let auction = auctions[i];
    let user = null;
    let highestBid = 0;
    if (auction.bidEnd < auction.bidStart) {
      if (auction.bids.length > 0) {
        for (j = 0; j < auction.bids.length; j++) {
          if (auction.bids[j].bid > highestBid) {
            highestBid = auction.bids[j].bid;
            user = auction.bids[j].bidder;
          }
        }
        let auctionId = auction._id;
        await Auction.findByIdAndUpdate(auctionId, {
          winner: user,
        });
        user = null;
      }
    }
  }
});
