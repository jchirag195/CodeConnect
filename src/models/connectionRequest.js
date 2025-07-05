const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId:{  
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: ['ignore', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorrect status type`,
        required: true,
    },
    
},{
    timestamps: true
});

    connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true  }); 

connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
    //Check if the fromUserId and toUserId are the same
    if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        return next(new Error("Cannot send connection request to yourself"));
    }
    next();
});

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequestModel;