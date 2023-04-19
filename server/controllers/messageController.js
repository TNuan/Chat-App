const messageModel = require('../models/messageModel')

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body
        const data = await messageModel.create({
            message: {text: message},
            user: [from, to],
            sender: from, 
        })
        if (data) return res.json({ msg: "Message added successfully"})
        return res,json({ msg: "Failed to add message to the database"})
    }catch (ex) {
        next(ex)
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const {from, to} = req.body
        const messages = await messageModel
            .find({
                user: {
                    $all: [from, to],
                },
            })
            .sort({ updateAt: 1})
            const projectMessage = messages.map((msg) => {
                return {
                    fromSelf: msg.sender.toString() === from,
                    message: msg.message.text,
                }
            })
            res.json(projectMessage)
    }catch (ex) {
        next(ex)
    }
}
