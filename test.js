#!/usr/bin/env node

require("source-map-support").install()
require("babel-register")()

require('blue-tape/bin/blue-tape')