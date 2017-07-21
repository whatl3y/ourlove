import passport from 'passport'

export default passport.authenticate("instagram", {
  // successRedirect:'/',
  successReturnToOrRedirect: '/',
  failureRedirect: '/oauth/instagram'
})
