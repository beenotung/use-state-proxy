#!/usr/bin/env node
let fs = require('fs')
let data = require('../package.json')
data.homepage = 'https://github.com/beenotung/use-state-proxy#readme'
let text = JSON.stringify(data, null, 2) + '\n'
fs.writeFileSync('package.json', text)

data = require('../tsconfig.json')
data.compilerOptions.jsx = 'react'
text = JSON.stringify(data, null, 2) + '\n'
fs.writeFileSync('tsconfig.json', text)
