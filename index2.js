const { nextISSTimesForMyLocation } = require('./iss_promised');

const printTimes = (passTimes) => {
  for (let pass of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(pass.risetime);
    console.log(`Next pass at ${dateTime} for ${pass['duration']} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then(pass => printTimes(pass))
  .catch((error) => console.log("It didn't work!", error.message));