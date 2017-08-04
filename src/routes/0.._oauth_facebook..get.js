import passport from 'passport'

export default passport.authenticate("facebook", {scope: ['email', 'user_photos']})
