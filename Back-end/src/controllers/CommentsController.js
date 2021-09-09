const {Comment} = require('../models') //models

module.exports  = {
    async getComments (req, res) {
        try {
            const comments = await Comment.findAll({
                order: [['createdAt', 'DESC']]
            })
            res.send({
                comments: comments,
                message: 'commentaires récupérés !'
            })
        } catch {
            res.status(500).send({
                error: 'An error occured trying to fetch the comments'
            })
        }
    },

    async createComment (req, res) {
        try{
            const comment = await Comment.create(req.body)
            res.send(comment)
        } catch {
            res.status(500).send({
                error: 'An error occured trying to create your comment'
            })
        }
    }
}
