if (process.env.NODE_ENV === 'production') { 
  module.exports = require('./prod').twitchAPI;
} else {
  module.exports = require('./dev').twitchAPI;
}
