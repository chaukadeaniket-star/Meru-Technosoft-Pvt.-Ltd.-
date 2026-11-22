const mongoose = require('mongoose')
const Lead = require('../models/Lead')

async function list({ search = '', status = '' } = {}) {
  const filter = {}
  if (status) filter.status = status
  if (search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    filter.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { company: { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } },
    ]
  }
  return Lead.find(filter).sort({ createdAt: -1 })
}

async function getById(id) {
  if (!mongoose.isValidObjectId(id)) return null
  return Lead.findById(id)
}

async function create(data) {
  return Lead.create(data)
}

async function update(id, data) {
  if (!mongoose.isValidObjectId(id)) return null
  return Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}

async function remove(id) {
  if (!mongoose.isValidObjectId(id)) return null
  return Lead.findByIdAndDelete(id)
}

module.exports = { list, getById, create, update, remove }
