

function Config() {
  console.log("Reading App config.  Always use process.env.PORT or localhost")
  this.port = process.env.PORT || 3000;
  this.proxyUrl = process.env.PROXY_URL || 'http://localhost:3001';
}

module.exports = new Config();
