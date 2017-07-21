import passport from 'passport'

export default passport.authenticate("facebook", {
  // successRedirect:'/',
  successReturnToOrRedirect: '/',
  failureRedirect: '/oauth/facebook'
})
