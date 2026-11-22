const mongoose = require('mongoose')

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost']
const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Event', 'Other']

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    source: { type: String, required: true, enum: SOURCES },
    status: { type: String, required: true, enum: STATUSES, default: 'New' },
  },
  { timestamps: true },
)

leadSchema.index({ name: 'text' })
leadSchema.index({ status: 1 })

module.exports = mongoose.model('Lead', leadSchema)
module.exports.STATUSES = STATUSES
module.exports.SOURCES = SOURCES
