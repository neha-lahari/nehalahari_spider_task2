const User = require('../models/user');
//to search users
exports.search_user = async (req, res,) => {
    const searchFriend = req.query.query;
    if (!searchFriend) {
        res.status(400).json({ message: "Friend details are required" });
    }
    try {
        const members = await User.find({
            $or: [
                { username: { $regex: searchFriend, $options: 'i' } },
                { email: { $regex: searchFriend, $options: 'i' } }
            ]

        }).select('-password');//except pw
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: "error searching users", error: err.message });
    }
};
//sending friend request
exports.send_request = async (req, res) => {
    const senderID = req.user.userId;
    const receiverID = req.params.id;

    if (senderID === receiverID) {
        return res.status(400).json({ message: "cannot send request to urself" });

    }
    try {
        const sender = await User.findById(senderID);
        const receiver = await User.findById(receiverID);
        if (receiver.friendRequests.includes(senderID) || sender.sentRequests.includes(receiverID)) {
            return res.status(400).json({ message: "request already sent" });

        } else {
            receiver.friendRequests.push(senderID);
            sender.sentRequests.push(receiverID);

            await receiver.save();
            await sender.save();
        }

        res.json({ message: "freind request sent" });
    } catch (err) {
        res.status(500).json({ message: "error sending request" });
    }
};
//accepting rquest
exports.accept_request = async (req, res) => {
    const myID = req.user.userId;
    const senderID = req.params.id;

    try {
        const me = await User.findById(myID);
        const sender = await User.findById(senderID);
        if (!me || !sender) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (!me.friendRequests.includes(senderID)) {
            return res.status(400).json({ msg: "No request from this user" });
        }

        me.friends.push(senderID);
        sender.friends.push(myID);
        me.friendRequests = me.friendRequests.filter(id => id.toString() !== senderID);
        sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== myID);

        await me.save();
        await sender.save();

        res.json({ msg: "Friend request accepted" });
    } catch (err) {
        res.status(500).json({ msg: "Error accepting request" });
    }
};
//REJECTING
exports.reject_request = async (req, res) => {
    const myId = req.user.userId;
    const senderId = req.params.id;

    try {
        const me = await User.findById(myId);
        const sender = await User.findById(senderId);

        if (!me || !sender) {
            return res.status(404).json({ msg: "User not found" });
        }
        me.friendRequests = me.friendRequests.filter(id => id.toString() !== senderId);
        sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== myId);

        await me.save();
        await sender.save();

        res.json({ msg: "Friend request rejected" });
    } catch (err) {
        res.status(500).json({ msg: "Error rejecting request" });
    }
};
//unfriend option
exports.unFriend = async (req, res) => {
    const myId = req.user.userId;
    const friendId = req.params.id;

    try {
        const me = await User.findById(myId);
        const friend = await User.findById(friendId);

        if (!me || !friend) {
            return res.status(404).json({ msg: "User not found" });
        }
        me.friends = me.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== myId);

        await me.save();
        await friend.save();

        res.json({ msg: "Unfriended successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Error unfriending" });
    }
};
// Get all friend-related data 
exports.getFriendStatus = async (req, res) => {
    const myId = req.user.userId;

    try {
        const me = await User.findById(myId)
            .populate('friendRequests', 'username email')
            .populate('sentRequests', 'username email')
            .populate('friends', 'username email');

        if (!me) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json({
            incomingRequests: me.friendRequests,
            sentRequests: me.sentRequests,
            friends: me.friends
        });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching friend status" });
    }
};
