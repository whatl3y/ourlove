import passport from 'passport'

export default passport.authenticate("pinterest", {
  // successRedirect:'/',
  successReturnToOrRedirect: '/',
  failureRedirect: '/oauth/pinterest'
})
