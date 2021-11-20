const request = require('request');
const ipAddressUrl = 'https://api.ipify.org?format=json';
const geoIPAddressUrl = 'https://api.freegeoip.app/json/?apikey='

const fetchMyIP = function(callback) {
  request(ipAddressUrl, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    return callback(error, JSON.parse(body)["ip"]);
  });
};

module.exports = {
  fetchMyIP
};