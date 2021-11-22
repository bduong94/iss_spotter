const request = require('request-promise-native');
const ipAddressUrl = 'https://api.ipify.org?format=json';
const geoIPAddressUrl = 'https://freegeoip.app/json/';

const fetchMyIP = () => request(ipAddressUrl);
const fetchCoordsByIP = (body) => request(geoIPAddressUrl+JSON.parse(body)['ip']);
const fetchISSFlyOverTimes = (body) => {
  let latitude = JSON.parse(body)['latitude'];
  let longitude = JSON.parse(body)['longitude'];
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
}

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(data => JSON.parse(data)['response']);
}

module.exports = {
  nextISSTimesForMyLocation
};