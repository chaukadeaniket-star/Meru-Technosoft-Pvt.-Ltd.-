const express = require('express')
const controller = require('../controllers/leadController')
const { leadRules, validateLead } = require('../middleware/validateLead')

const router = express.Router()
router.get('/', controller.list)
router.post('/', leadRules, validateLead, controller.create)
router.get('/:id', controller.get)
router.put('/:id', leadRules, validateLead, controller.update)
router.delete('/:id', controller.remove)

module.exports = router
