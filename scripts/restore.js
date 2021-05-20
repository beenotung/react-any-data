#!/usr/bin/env node
let fs = require('fs')
let data = require('../package.json')
data.homepage = 'https://github.com/beenotung/react-any-data#readme'
let text = JSON.stringify(data, null, 2) + '\n'
fs.writeFileSync('package.json', text)
