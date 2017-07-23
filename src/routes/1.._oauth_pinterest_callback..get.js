import passport from 'passport'

export default passport.authenticate("pinterest", {
  // successRedirect:'/',
  successReturnToOrRedirect: '/redirect',
  failureRedirect: '/oauth/pinterest'
})
