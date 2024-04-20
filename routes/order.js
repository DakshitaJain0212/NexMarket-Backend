const {
  CreateOrder,
  updateOrder,
  fetchAllUsers,
  fetchOrders,
} = require("../controller/Order");

const express = require("express");

const router = express.Router();

router
  .post("/", CreateOrder)
  .patch("/:id", updateOrder)
  .get("/:id", fetchAllUsers)
  .get("/",fetchOrders);

exports.router = router;
