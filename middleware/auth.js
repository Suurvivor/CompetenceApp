const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const PlanedTraining = require('../models/PlaningTraining');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
   }
   // else if (req.cookies.token){
   //   token = req.cookies.token;
   // }

   //Check if token exists
   if (!token) {
      return next(new ErrorResponse('Not authrozied', 401));
   }

   try {
      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).populate({
         path: 'workplace',
         populate: {
            path: 'department',
         },
      });
      if (!req.user) {
         return next(new ErrorResponse('Not authorized', 401));
      }

      const trains = await PlanedTraining.find({ trainedUserId: req.user._id })
         .populate({
            path: 'competenceId',
            select: '_id name',
            populate: {
               path: 'createdBy',
               select: '_id name',
            },
         })
         .sort({ trainingDate: 1 });
      req.user.planedTraining = [...trains];

      next();
   } catch (err) {
      return next(new ErrorResponse('Not authrozied', 401));
   }
});

exports.authorize = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(new ErrorResponse(`${req.user.role}: Not  authorized`, 403));
      }
      next();
   };
};