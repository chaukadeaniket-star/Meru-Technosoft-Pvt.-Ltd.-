const leadService = require('../services/leadService')

async function list(req, res, next) {
  try {
    const leads = await leadService.list({ search: req.query.search || '', status: req.query.status || '' })
    res.json({ data: leads })
  } catch (error) { next(error) }
}

async function get(req, res, next) {
  try {
    const lead = await leadService.getById(req.params.id)
    if (!lead) return res.status(404).json({ message: 'Lead not found.' })
    res.json({ data: lead })
  } catch (error) { next(error) }
}

async function create(req, res, next) {
  try {
    const lead = await leadService.create(req.body)
    res.status(201).json({ data: lead, message: 'Lead added successfully.' })
  } catch (error) { next(error) }
}

async function update(req, res, next) {
  try {
    const lead = await leadService.update(req.params.id, req.body)
    if (!lead) return res.status(404).json({ message: 'Lead not found.' })
    res.json({ data: lead, message: 'Lead updated successfully.' })
  } catch (error) { next(error) }
}

async function remove(req, res, next) {
  try {
    const lead = await leadService.remove(req.params.id)
    if (!lead) return res.status(404).json({ message: 'Lead not found.' })
    res.json({ message: 'Lead deleted successfully.' })
  } catch (error) { next(error) }
}

module.exports = { list, get, create, update, remove }
