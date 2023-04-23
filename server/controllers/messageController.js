const messageModel = require('../models/messageModel')

module.exports.addMessage = async (req, res, next) => {
    try {
        console.log('addMessage here')
        const { from, to, message } = req.body
        const data = await messageModel.create({
            message: { text: message },
            user: [from, to],
            sender: from,
            _removed: false,
        })
        if (data) return res.json({ msg: "Message added successfully" })
        return res.json({ msg: "Failed to add message to the database" })
    } catch (ex) {
        next(ex)
    }
}

module.exports.updateMessage = async (req, res, next) => {
    try {
        console.log('hi')
        const { updatedMessageId, fromSelf } = req.body
        const message = await messageModel.findOne({_id: updatedMessageId})

        const dataUpdated = {
            ...message.toObject(),
            _removed: true,
            removedFromSelf: fromSelf,
        }

        console.log(dataUpdated)
        const updatedMessage = await messageModel.updateOne({_id: dataUpdated._id}, {$set: dataUpdated})
        if (updatedMessageId) delete updatedMessageId
        if (updatedMessage) return res.json({ msg: "Message updated successfully" })
        return res.json({ msg: "Failed to update message" })
    } catch (ex) {
        next(ex)
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body
        const messages = await messageModel
            .find({
                user: {
                    $all: [from, to],
                },
            })
            .sort({ updateAt: 1 })
        const projectMessage = messages.map((msg) => {
            return {
                _id: msg._id,
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            }
        })
        res.json(projectMessage)
    } catch (ex) {
        next(ex)
    }
}
