const express = require('express')
const cors = require('cors')
const leadRoutes = require('./routes/leadRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/leads', leadRoutes)
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }))
app.use(errorHandler)

module.exports = app
