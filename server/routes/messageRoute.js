const { addMessage, getAllMessage, removeMessage } = require('../controllers/messageController')
const router = require('express').Router()

router.post('/addmsg', addMessage)
router.delete('/removemsg', removeMessage)
router.post('/getmsg', getAllMessage)

module.exports = router
