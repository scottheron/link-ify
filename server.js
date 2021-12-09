const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

var username = process.env.DB_USER
var password = process.env.DB_PASSWORD
var hosts = 'iad2-c16-1.mongo.objectrocket.com:54679,iad2-c16-2.mongo.objectrocket.com:54679,iad2-c16-0.mongo.objectrocket.com:54679'
var database = 'urlShortener'
var options = '?replicaSet=95f7e1f12bec43dc965e77f90fc3a992&retryWrites=false'
var connectionString = process.env.DB_USER ? 'mongodb://' + username + ':' + password + '@' + hosts + '/' + database + options : 'mongodb://localhost/urlShortener'

mongoose.connect(connectionString ||'mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
});

// mongoose.connect(process.env.ORMONGO_SHORTENER_URL ||'mongodb://localhost/urlShortener', {
//     useNewUrlParser: true, useUnifiedTopology: true
// })

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);