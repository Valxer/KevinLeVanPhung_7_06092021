const {Post, sequelize} = require('../models') //models
const {User} = require('../models') //models
const {Comment} = require('../models')

module.exports  = {
    async getFeed (req, res) {
        try {
            const posts = await Post.sequelize.query('SELECT Posts.id, Posts.title, Posts.date, Posts.image, Posts.commentCount, Users.name, Users.profilePic FROM Posts LEFT JOIN Users ON Posts.ownerId = Users.id ORDER BY Posts.date DESC LIMIT 0,30',
                {type: sequelize.QueryTypes.SELECT}
            )
            res.send(posts)
        } catch {
            res.status(500).send({
                error: 'An error occured trying to fetch the posts'
            })
        }
    },

    // async createPost (req, res) {
    //     const postObject = JSON.parse(req.body.post)
    //     console.log('body.post :', postObject)
    //     try {
    //         const owner = await User.findOne({   //tries to find a user with the given email               
    //             where: {
    //                 id: postObject.userId
    //             }
    //         })
    //         if(!owner) {
    //             res.status(404).send({
    //                 error: 'Could not find the user trying to create this post'
    //             })
    //         } else {
    //             const post = await owner.createPost({
    //                 ...postObject.post,
    //                 image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    //             })
    //             res.send(post)
    //         }
    //     } catch {
    //         res.status(500).send({
    //             error: 'An error occured while creating the post'
    //         })
    //     }
    // },
    async createPost (req, res) {
        try {
            const owner = await User.findOne({   //tries to find a user with the given email               
                where: {
                    id: req.body.userId
                }
            })
            if(!owner) {
                res.status(404).send({
                    error: 'Could not find the user trying to create this post'
                })
            } else {
                const post = await owner.createPost(req.body.post)
                res.send(post)
            }
        } catch {
            res.status(500).send({
                error: 'An error occured while creating the post'
            })
        }
    },

    async getPost (req, res) {
        try {
            const post = await Post.sequelize.query('SELECT Posts.id, Posts.title, Posts.date, Posts.image, Posts.commentCount, Users.name, Users.profilePic FROM Posts INNER JOIN Users ON Posts.ownerId = Users.id WHERE Posts.id = :id',
                {
                    replacements: {
                        id : req.params.id
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            )
            if (!post) {                        //if such a post is  not found
                return res.status(404).send({
                    error: 'The post you are looking for doesn\'t exist'
                })
            }
            const comments = await Comment.sequelize.query('SELECT Users.name, Users.id AS userId, Users.profilePic, Comments.id, Comments.content, Comments.date FROM Comments LEFT JOIN Users ON Comments.ownerId = Users.id WHERE Comments.PostId = :id ORDER BY Comments.date DESC LIMIT 0,30',
                {
                    replacements: {
                        id : req.params.id
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            )
            if (!comments) {                        //if such a comment is  not found
                return res.status(404).send({
                    error: 'The comments you are looking for don\'t exist'
                })
            }
            const postJson = post[0]
            res.send({
                post: postJson,
                comments: comments
            })
        } catch {
            res.status(500).send({
                error: 'An error occured trying to fetch the post'
            })
        }
    },

    async editPost (req, res) {
        try {
            const post = await Post.update(req.body, {
                where: {
                    id: req.params.id
                }
            })
            if (!post) {
                return res.status(404).send({
                    error: 'Couldn\'t update the Post'
                })
            }
            const updated = await Post.findOne({
                where: {
                    id: req.params.id
                }
            })
            res.status(200).send(updated)
        } catch {
            res.status(500).send({
                error: 'An error occured trying to update the Post'
            })
        }
    },

    async deletePost (req, res) {
        try {
            await Post.destroy({   //suppresses the given post             
                where: {
                    id: req.params.id
                }
            })
            res.status(200).send({
                message: 'Post successfully deleted'
            })
        } catch {
            res.status(500).send({
                error: 'An error occured trying to delete the post'
            })
        }
    }
}