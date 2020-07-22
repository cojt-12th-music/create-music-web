const functions = require('firebase-functions')

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

  // const path = req.path // "/"

  if (isBot) {
    // bot の場合
    // ogp を設定した html を返す
  } else {
    // bot 以外（ユーザー）の場合
    // ogp を抜いたパスにリダイレクトしてあげる
  }
  res.send(isBot)
})
