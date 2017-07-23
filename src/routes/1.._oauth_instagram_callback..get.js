import passport from 'passport'

export default passport.authenticate("instagram", {
  // successRedirect:'/',
  successReturnToOrRedirect: '/redirect',
  failureRedirect: '/oauth/instagram'
})
