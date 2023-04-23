const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
        message: { 
            text: { type: String, required: true },
        },
        user: Array,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        _removed: { type: Boolean, default: false, required: true},
        removedFromSelf: { type: Boolean, default: false, required: true}
    },
    {
        timestamps: true,            
    }
)

module.exports = mongoose.model('Messages', messageSchema)
