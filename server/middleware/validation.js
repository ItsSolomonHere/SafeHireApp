const Joi = require('joi');

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^(\+254|0)[17]\d{8}$/).required(),
    password: Joi.string().min(6).required(),
    location: Joi.string().required(),
    role: Joi.string().valid('employer', 'worker').required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateWorkerProfile = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string().valid(
      'fundi', 'domestic', 'boda', 'gardener', 'painter', 
      'event-crew', 'security', 'tutor', 'delivery', 'driver'
    ).required(),
    skills: Joi.array().items(Joi.string()).min(1).required(),
    bio: Joi.string().max(500).required(),
    hourlyRate: Joi.number().min(100).required(),
    dailyRate: Joi.number().min(500).required(),
    workingHours: Joi.object({
      start: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    }),
    preferredLocations: Joi.array().items(Joi.string()),
    languages: Joi.array().items(Joi.string()),
    experience: Joi.number().min(0)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateBooking = (req, res, next) => {
  const schema = Joi.object({
    workerId: Joi.string().required(),
    jobTitle: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    scheduledDate: Joi.date().min('now').required(),
    startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    duration: Joi.number().min(1).required(),
    specialRequirements: Joi.string().max(500)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateMessage = (req, res, next) => {
  const schema = Joi.object({
    receiverId: Joi.string().required(),
    content: Joi.string().max(1000).required(),
    messageType: Joi.string().valid('text', 'image', 'file').default('text'),
    bookingId: Joi.string()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateReview = (req, res, next) => {
  const schema = Joi.object({
    bookingId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(500).required(),
    categories: Joi.array().items(Joi.string().valid(
      'punctuality', 'quality', 'communication', 'professionalism', 'value'
    )),
    isAnonymous: Joi.boolean()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateWorkerProfile,
  validateBooking,
  validateMessage,
  validateReview
}; 