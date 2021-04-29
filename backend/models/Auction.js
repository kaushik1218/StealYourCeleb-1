const mongoose = require("mongoose");
const AuctionSchema = new mongoose.Schema({
  itemName: {
    type: String,
    trim: true,
    required: "Item name is required",
  },
  description: {
    type: String,
    trim: true,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },

  bidStart: {
    type: Date,
    default: Date.now,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  bidEnd: {
    type: Date,
    required: "Auction end time is required",
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  startingBid: { type: Number, default: 0 },
  bids: [
    {
      bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      bid: Number,
      time: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Auction", AuctionSchema);
