// const firebase = require('firebase/app')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

exports.returnDynamicOGP = functions.https.onRequest((req, res) => {
  const userAgent = req.headers['user-agent'].toLowerCase()

  // ユーザーアクセスはリダイレクト
  if (!isBot(userAgent)) {
    res.redirect('/?id=' + res.query.id)
    return
  }

  admin.initializeApp()
  admin
    .firestore()
    .collection('scores')
    .doc(req.query.id)
    .get()
    .then((doc) => {
      // 存在しないIDなら404を返す
      if (!doc.exists) {
        res.send(404)
        return
      }

      const data = doc.data()
      const composer = data.composer
      const title = data.title

      const html = createHtml(title, composer)
      res.status(200).send(html)
    })
})

const isBot = (userAgent) =>
  !!(
    userAgent.includes('googlebot') ||
    userAgent.includes('yahoou') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('baiduspider') ||
    userAgent.includes('yandex') ||
    userAgent.includes('yeti') ||
    userAgent.includes('yodaobot') ||
    userAgent.includes('gigabot') ||
    userAgent.includes('ia_archiver') ||
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('developers.google.com')
  )

const createHtml = (title, description) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>OGP Test</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:description"${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="music-sharp" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
  </head>
  <body>For Twitter Bot</body>
</html>
`
}
