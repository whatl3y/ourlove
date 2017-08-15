import path from 'path'

export default function(req,res) {
  res.sendFile(path.resolve(`${__dirname}/../views/privacy_policy.html`))
}
