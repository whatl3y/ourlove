import passport from 'passport'

export default passport.authenticate("facebook", {
  // successRedirect:'/',
  successReturnToOrRedirect: '/redirect',
  failureRedirect: '/oauth/facebook'
})
