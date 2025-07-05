const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const User = require("../models/user");
const userId = require("../middlewares/auth").userId;
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = req.user._id;
      const toUserId = req.params.touserId.trim();
      const status = req.params.status;

      const allowedStatuses = ["ignore", "interested"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: `User with ID ${toUserId} not found`,
        });
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ],
      });
        if (existingConnectionRequest) {
            return res.status(400).json({
            message: `Connection request already exists between ${user.firstName} and the user with ID ${toUserId}`,
            });
        }

      const ConnectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await ConnectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try { 
    const loggendInUser = req.user;
    const status = req.params.status.trim();
    const requestId = req.params.requestId.trim();

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type: " + status,
      });
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggendInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: `Connection request with ID ${requestId} not found or not in interested status`,
      }); 
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res.json({
      message: `Connection request ${status} successfully.`,
    });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


module.exports = requestRouter;
