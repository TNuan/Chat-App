const { addMessage, getAllMessage, updateMessage } = require('../controllers/messageController')
const router = require('express').Router()

router.post('/addmsg', addMessage)
router.put('/updatemsg', updateMessage)
router.post('/getmsg', getAllMessage)

module.exports = router
