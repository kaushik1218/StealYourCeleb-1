const Celebrity = require("../models/Celebrity");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("cloudinary");
// Create a new celebrity   =>  /api/v1/celebrity/createNewCelebrity
exports.createNewCelebrity = catchAsyncErrors(async (req, res, next) => {
  const { name, description, type } = req.body;
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
  const celebrity = await Celebrity.create({
    name,
    description,
    type,
    images: req.body.images,
  });

  res.status(200).json({
    success: true,
    celebrity,
  });
});

// get All Celebrties   =>  /api/v1/celebrity/getAllCelebrties
exports.getAllCelebrties = catchAsyncErrors(async (req, res, next) => {
  const celebrities = await Celebrity.find({});

  res.status(200).json({
    success: true,
    data: celebrities,
  });
});

// get All Celebrties   =>  /api/v1/celebrity/getCelebrityWiseProducts?id=celebrityId
exports.getCelebrityWiseProducts = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.query;
  if (!id) {
    return next(new ErrorHandler("No Parameter Provided", 400));
  }

  const products = await Product.find({ celebrity: id });

  res.status(200).json({
    success: true,
    data: products,
  });
});

//  Update Celebrity   =>  /api/v1/celebrity/updateCelebrity
exports.updateCelebrity = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.query;
  if (!id) {
    return next(new ErrorHandler("No Parameter Provided", 400));
  }
  const celebrity = await Celebrity.findById(id);

  if (!celebrity) {
    return next(new ErrorHandler("Celebrity not found", 404));
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting images associated with the celebrity
    const deletedImage = await cloudinary.v2.uploader.destroy(
      celebrity.public_id
    );

    const result = await cloudinary.v2.uploader.upload(images[0], {
      folder: "products",
    });
    req.body.public_id = result.public_id;
    req.body.secure_url = result.secure_url;
  }
  await celebiry.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Celebrity Updated Successfully",
  });
});

//  Get Single Celebrity   =>  /api/v1/celebrity/singleCelebrity
exports.singleCelebrity = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.query;
  if (!id) {
    return next(new ErrorHandler("No Parameter Provided", 400));
  }
  const celebrity = await Celebrity.findById(id);

  if (!celebrity) {
    return next(new ErrorHandler("Celebrity not found", 404));
  }

  res.status(200).json({
    success: true,
    celebrity,
  });
});

//  Delete Celebrity   =>  /api/v1/celebrity/deleteCelebrity
exports.deleteCelebrity = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.query;
  if (!id) {
    return next(new ErrorHandler("No Parameter Provided", 400));
  }
  const celebrity = await Celebrity.findById(id);

  if (!celebrity) {
    return next(new ErrorHandler("Celebrity not found", 404));
  }
  for (let i = 0; i < celebrity.images.length; i++) {
    const result = await cloudinary.v2.uploader.destroy(
      celebrity.images[i].public_id
    );
  }

  await celebrity.remove();
  await Product.deleteMany({
    celebrity: id,
  });
  res.status(200).json({
    success: true,
    message: "Celebrity is deleted.",
  });
});
