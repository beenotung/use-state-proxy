#!/usr/bin/env node
let fs = require('fs')
let data = require('../package.json')
delete data.homepage
fs.writeFileSync('package.json', JSON.stringify(data, null, 2))
