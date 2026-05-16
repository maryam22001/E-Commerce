const UserModel = require('../models/user.js');
const ApiFeature = require('../utils/ApiFeatures.js');
const catchAsync = require('../utils/catchAsync.js');

exports.GetAllUsers = catchAsync(async (req, res) => {
    const feature = new ApiFeature(
        UserModel.find({ isDeleted: false }), req.query
    ).filter().fields().sort().search().pagination();

    const users = await feature.query;
    const totalCount = await UserModel.countDocuments({ isDeleted: false });

    res.status(200).json({
        success: true,
        results: users.length,
        count: totalCount,
        limit: feature.limit,
        page: Math.ceil(totalCount / feature.limit),
        data: users
    });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);
    if (!user || user.isDeleted)
        return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: user });
});

exports.getDeletedUsers = catchAsync(async (req, res, next) => {
    const users = await UserModel.find({ isDeleted: true });
    res.status(200).json({ success: true, data: users });
});

exports.addUser = catchAsync(async (req, res, next) => {
    const user = await UserModel.create(req.body);
    res.status(201).json({ success: true, data: user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await UserModel.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { ...req.body, updatedAt: Date.now() },
        { runValidators: true, new: true }
    );
    if (!user)
        return res.status(404).json({ success: false, message: `User not found with id ${req.params.id}` });

    res.status(200).json({ success: true, data: user });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await UserModel.findOneAndDelete({ _id: req.params.id, isDeleted: false });
    if (!user)
        return res.status(404).json({ success: false, message: `User not found with id ${req.params.id}` });

    res.status(204).send();
});

exports.softDeleteUser = catchAsync(async (req, res, next) => {
    const user = await UserModel.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { isDeleted: true, updatedAt: Date.now() },
        { new: true }
    );
    if (!user)
        return res.status(404).json({ success: false, message: `User not found with id ${req.params.id}` });

    res.status(200).json({ success: true, data: user });
});