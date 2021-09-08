const AuthController = require('./controllers/AuthController')
const AuthControllerPolicy = require('./policies/AuthControllerPolicy')
const PostsController = require('./controllers/PostsController')

module.exports = (app) => {
    app.post('/signin',AuthControllerPolicy.signin, AuthController.signin),
    app.post('/login', AuthController.login),
    app.get('/feed', PostsController.getFeed)
}
