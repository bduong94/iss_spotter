const request = require('request');
const ipAddressUrl = 'https://api.ipify.org?format=json';
const geoIPAddressUrl = 'https://freegeoip.app/json/';

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
  request(geoIPAddressUrl + ip, (error, response, body) =>{
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode === 404) {
      const msg = `Status Code ${response.statusCode} when fetching geo coordinates. IP is invalid: ${ip}`;
      return callback(Error(msg), null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching geo coordinates. Response: ${body}`;
      return callback(Error(msg), null);
    }
    
    const { latitude, longitude } = JSON.parse(body);

    return callback(error, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = (coordinates, callback) => {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coordinates['latitude']}&lon=${coordinates['longitude']}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching risetimes. Response: ${body}`;
      return callback(Error(msg), null);
    }

    let passes = JSON.parse(body)['response'];

    return callback(error, passes);
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes
};