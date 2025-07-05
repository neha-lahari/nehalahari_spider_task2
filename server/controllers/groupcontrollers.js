const Group = require("../models/groups");
const User = require("../models/user");
const Activity = require("../models/activity");
//to create new
exports.createGroup = async (req, res) => {
    const { name, members = [] } = req.body;
    const user = req.user.userId;
    try {
        const me = await User.findById(user).populate('friends', 'username');
        if (!me) {
            return res.status(404).json({ message: "User not found" });
        }

        const myFriendUsernames = me.friends.map(f => f.username);
        const notFriends = members.filter(m => !myFriendUsernames.includes(m));
        if (notFriends.length > 0) {
            return res.status(400).json({ message: "Only friends can be added", notFriends });
        }
        const selectedUsers = await User.find({ username: { $in: members } });
        const memberIds = selectedUsers.map(u => u._id);
        const group = new Group({
            name,
            members: [...memberIds, user],
            createdBy: user,
        });

        await group.save();

        await Activity.create({//grp created activity
            user: req.user.userId,
            group: group._id,
            groupName: group.name,
            type: "group_created",
        });

        await User.updateMany(
            { _id: { $in: [...memberIds, user] } },
            { $push: { groups: group._id } }
        );

        res.status(201).json({ message: "Group created", group });
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
};
//remove member
exports.removeMem = async (req, res) => {
    const groupId = req.params.id;
    const { memberId } = req.body;
    const user = req.user.userId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "no such group exists" });
        }
        if (group.createdBy.toString() !== user) {
            return res.status(403).json({ message: "not allowed" });
        }
        group.members = group.members.filter(m => m.toString() != memberId);
        await group.save();

        await User.findByIdAndUpdate(memberId, {
            $pull: { groups: groupId }
        });

        res.json({ message: "removed", group });
    } catch (err) {
        res.status(500).json({ message: "error", error: err.message });
    }
};
//delete grp
exports.deleteGroup = async (req, res) => {
    const groupId = req.params.id;
    const user = req.user.userId;
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "no such group exists" });
        }
        if (group.createdBy != user) {
            return res.status(403).json({ message: "not allowed" });
        }

        await Activity.create({//grp deleted activity
            user: req.user.userId,
            group: groupId,
            groupName: group.name,
            type: "group_deleted",
        });

        await User.updateMany(
            { _id: { $in: group.members } },
            { $pull: { groups: groupId } }
        );

        await Group.findByIdAndDelete(groupId);

        res.json({ message: "deleted" });
    } catch (err) {
        res.status(500).json({ message: "error", error: err.message });
    }
};
//to show existing grpss
exports.MyGroups = async (req, res) => {
    try {
        const me = await User.findById(req.user.userId).populate({
            path: "groups",
            populate: {
                path: "createdBy",
                select: "_id username",
            },
        });
        if (!me) {
            return res.status(404).json({ message: "User not found" });
        }
        const groupsWithCreator = me.groups.map(group => ({
            _id: group._id,
            name: group.name,
            createdBy: group.createdBy._id.toString(),
        }));

        res.json({ groups: groupsWithCreator });
    } catch (err) {
        res.status(500).json({ message: "Error fetching groups", error: err.message });
    }
};
//to show group details
exports.getGroupById = async (req, res) => {
    const groupId = req.params.id;
    try {
        const group = await Group.findById(groupId)
            .populate("members", "username")
            .populate("createdBy", "username");

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.json({ group });
    } catch (err) {
        res.status(500).json({ message: "Error fetching group", error: err.message });
    }
};
//to get the details of grp
exports.getGroupDetails = async (req, res) => {
    const groupId = req.params.id;

    try {
        const group = await Group.findById(groupId).populate("members", "username");
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        res.json({
            _id: group._id,
            name: group.name,
            members: group.members,
            createdAt: group.createdAt,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching group", error: err.message });
    }
};
