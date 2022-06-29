
const { ServiceProvider } = require('@haluka/core')
const passport = require('passport')
const { Strategy } = require('passport-local')
const UserSchema = require('./User').default

exports.default = class PassportServiceProvider extends ServiceProvider {
	register () {
        // Default UserModel
        this.app.register('UserModel', () => UserSchema)
        // Passport
		this.app.singleton('Haluka/Provider/Passport/Local', function (app, { UserModel } ) {
            passport.use(new Strategy(async (username, password, cb) => {
				let promise = Promise.resolve()
				.then(() => UserModel.findOne({ username }))
				.then(async user => {
					if (!user)
						return { user: false, err: new Error("User not found.") }
					if (!await (user).verifyPassword(password))
						return { user: false, err: new Error("Incorrect password.") }
					return { user: user, err: null }
				})
				if (!cb) return promise
				promise.then(({ user, err }) => cb(null, user, err)).catch(err => cb(err))
            }))
            passport.serializeUser(function(user, cb) {
				cb(null, user.username);
			})
            passport.deserializeUser((username, cb) => {
				UserModel.findOne({ username }).exec(cb)
			})

			app.save('Haluka/Provider/Passport/Local/Middleware', function (loginPath) {
				return (req, res, next) => {
					if ((!req.isAuthenticated || !req.isAuthenticated())) {
						return res.redirect(loginPath)
					}
					res.locals.loggedUser = req.user
					next()
				}
			})

            app.save('Haluka/Provider/Passport/Local/GodMode', function (UserObj) {
                return (req, res, next) => {
                    req.isAuthenticated = () => true
                    req.user = UserObj
                    res.locals.loggedUser = req.user
                    next()
                }
            })

			return passport
		})
	}
}