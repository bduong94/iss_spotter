const request = require('request');
const ipAddressUrl = 'https://api.ipify.org?format=json';
const geoIPAddressUrl = 'https://freegeoip.app/json/'

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

const fetchCoordsByIP = (ip, callback) => {
  request(geoIPAddressUrl+ip, (error, response, body) =>{
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode === 404) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. IP is invalid: ${ip}`;
      return callback(Error(msg), null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching geo coordinates. Response: ${body}`;
      return callback(Error(msg), null);
    }
    
    const { latitude, longitude } = JSON.parse(body);

    return callback(error, { latitude, longitude } );
  })
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP
};