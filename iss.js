const request = require('request');
const ipAddressUrl = 'https://api.ipify.org?format=json';
const geoIPAddressUrl = 'https://freegeoip.app/json/';


//Fetches IP address using ipAddressURL
const fetchMyIP = function(callback) {
  request(ipAddressUrl, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }
    let ip = JSON.parse(body)["ip"];
    callback(error, ip);
    return;
  });
};

//Fetches IP address using geoIPAddressUrl
const fetchCoordsByIP = (ip, callback) => {
  request(geoIPAddressUrl + ip, (error, response, body) =>{
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode === 404) {
      const msg = `Status Code ${response.statusCode} when fetching geo coordinates. IP is invalid: ${ip}`;
      callback(Error(msg), null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching geo coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const { latitude, longitude } = JSON.parse(body);

    callback(error, { latitude, longitude });
    return { latitude, longitude };
  });
};

//Fetches ISSFlyOverTime using coordinates from fetchCoordsByIP
const fetchISSFlyOverTimes = (coordinates, callback) => {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coordinates['latitude']}&lon=${coordinates['longitude']}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching risetimes. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    let passes = JSON.parse(body)['response'];

    callback(error, passes);
    return;
  });
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
  
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }
  
      fetchISSFlyOverTimes(coordinates, (error, passes) => {
        if (error) {
          console.log("It didn't work!", error);
          return;
        }
    
        callback(null, passes);
      });
    });
  });
  
};

module.exports = {
  nextISSTimesForMyLocation
};