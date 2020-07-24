// const firebase = require('firebase/app')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

exports.returnDynamicOGP = functions.https.onRequest((req, res) => {
  const userAgent = req.headers['user-agent'].toLowerCase()

  const isBot = !!(
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

  let data
  let composer = ''
  let title = ''

  admin.initializeApp()
  admin
    .firestore()
    .collection('scores')
    .doc(req.query.id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        data = doc.data()
        composer = data.composer
        title = data.title
        // res.send(composer + ' ' + title + ' ' + req.path)
      } else {
        console.log('404')
        res.send('404')
      }
    })
    .catch((error) => {
      console.log(`データが取得できず${error}`)
    })

  // const path = req.path // "/"

  if (isBot) {
    // bot の場合
    // ogp を設定した html を返す
    const html = createHtml(title, composer)
    res.status(200).send(html)
  } else {
    // bot 以外（ユーザー）の場合
    // ogp を抜いたパスにリダイレクトしてあげる
    res.redirect('/?id=' + res.query.id)
  }
})

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
