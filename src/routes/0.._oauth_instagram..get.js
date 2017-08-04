import passport from 'passport'

export default passport.authenticate("instagram", {scope: ['basic']})
