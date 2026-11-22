const { body, validationResult } = require('express-validator')
const { STATUSES, SOURCES } = require('../models/Lead')

const leadRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer'),
  body('email').trim().isEmail().withMessage('Enter a valid email address').isLength({ max: 254 }).normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 30 }).withMessage('Phone must be 30 characters or fewer'),
  body('company').trim().notEmpty().withMessage('Company is required').isLength({ max: 120 }).withMessage('Company must be 120 characters or fewer'),
  body('source').isIn(SOURCES).withMessage('Select a valid lead source'),
  body('status').optional().isIn(STATUSES).withMessage('Select a valid lead status'),
]

function validateLead(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Please check the lead details.', errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })) })
  }
  next()
}

module.exports = { leadRules, validateLead }
