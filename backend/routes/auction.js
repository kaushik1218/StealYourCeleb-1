const express = require("express");
const router = express.Router();

const {
  createAuction,
  getAllAuctions,
  getSingleAuction,
  placeBid,
  payForWinner
} = require("../controllers/auctionController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router
  .route("/admin/auctions/createAuction")
  .post(isAuthenticatedUser, createAuction);
router
  .route("/admin/auctions/getAllAuctions")
  .get(isAuthenticatedUser, getAllAuctions);
  router.route("/auctions/placeBid").post(isAuthenticatedUser, placeBid);
  router.route("/auctions/winner-payment").post(isAuthenticatedUser, payForWinner);
router.route("/auctions").get(isAuthenticatedUser, getAllAuctions);
router.route("/auctions/details").get(isAuthenticatedUser, getSingleAuction);

module.exports = router;
