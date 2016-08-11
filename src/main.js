
let co = require('co')
let _ = require('lodash')
let colors = require('colors')
let nodemailer = require('nodemailer')
let directTransport = require('nodemailer-direct-transport')

/* global VERSION */

let mailer = Promise.promisifyAll(nodemailer.createTransport(directTransport({
  name: 'dirmail',
  logger: true,
  debug: true,
  retryOnFailure: false
})))

var HELPTEXT = `

    dirmail ${VERSION}
    ==============================
    Send an email directly to the receiving MX server.

    Options:
      -t         To
      -f         From
      -s         Subject
      -m         Message

`

module.exports = function (argv) {
  return co(function *() {
    let mail = Object.assign({
      t: null,
      f: null,
      s: null,
      m: null
    }, _.pick(argv, ['t', 'f', 's', 'm']))

    if (!mail.t && !mail.f && !mail.s && !mail.m) {
      console.log(HELPTEXT)
      return
    }

    if (!mail.t) {
      console.log(colors.red('To address is required!'))
      return
    }

    yield mailer.sendMailAsync({
      from: mail.f,
      to: mail.t,
      subject: mail.s,
      text: mail.m
    })
  }).catch(function (err) {
    if (err.stack) {
      err = err.stack
    }
    console.log(colors.red(err))
  })
}
