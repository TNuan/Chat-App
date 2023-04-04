const { register, login, setAvatar, getAllusers } = require('../controllers/userController')

const router = require('express').Router()

router.post('/login', login)
router.post('/register', register)
router.get('/allusers/:id', getAllusers)
router.post('/setAvatar/:id', setAvatar)

module.exports = router
