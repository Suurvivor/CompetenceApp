const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const PlaningTraining = require('../models/PlaningTraining');
const Competence = require('../models/Competence');
const User = require('../models/User');

exports.getPlanedTraining = asyncHandler(async (req, res, next) => {
  let planedTrainingForUsers = null;
  if (req.user.role == 'trainer'){
    console.log('trener');
    planedTrainingForUsers = await PlaningTraining.find({createdBy: req.user.id}).populate({
      path: 'competenceId',
      select: 'name workplace'
    });
  }
  const planedTraining = await PlaningTraining.find({trainedUserId: req.user.id}).populate({
    path: 'competenceId',
    select: 'name workplace'
  });

  res.status(201).json({
    succes: true,
    trainingToMakeForTeacher: planedTrainingForUsers,
    data: planedTraining
  });
});

exports.planTraining = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  //Validation
  if (req.body.trainedUserId === req.body.createdBy){
    return next(new ErrorResponse('Cant plan train for yourself', 400));
  }
  const competence = await Competence.findById(req.body.competenceId);
  const user = await User.findById(req.body.trainedUserId);
  if (!user || !competence){
    return next(new ErrorResponse('Wrong competence or trained user', 400));
  }
  console.log('user: ' + user)
  //To do add validation cant plan training for past.

  const planedTraining = await PlaningTraining.create(req.body);

  res.status(201).json({
    succes: true,
    data: planedTraining
  });
});

exports.aproveTraining = asyncHandler(async (req, res, next) => {
  const planedTraining = await PlaningTraining.findById(req.params.planedTrainingId);
  const user = await User.findById(planedTraining.trainedUserId);
  const ratingData = {
    competence_id: planedTraining.competenceId,
    rating: req.body.rating,
    lastmodify: null,
    lastmodify_by: null,
    created_at: Date.now(),
    created_by: req.user.id
  }
  let pulledDataFromCallBack = '';
  const test = await user.addNewRatingOrUpdateIfExists(planedTraining.competenceId, ratingData, req.user.id, function(data){
    pulledDataFromCallBack = data;
  });
  planedTraining.remove();

  res.status(201).json({
    succes: true,
    data: pulledDataFromCallBack
  });
});