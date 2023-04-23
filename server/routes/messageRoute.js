const { addMessage, getAllMessage, updateMessage } = require('../controllers/messageController')
const router = require('express').Router()

router.post('/addmsg', addMessage)
router.post('/getmsg', getAllMessage)
router.put('/updatemsg', updateMessage)

module.exports = router
