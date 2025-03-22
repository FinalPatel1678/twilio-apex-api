const moment = require("moment-timezone");

exports.handler = function (context, event, callback) {
    // Get the current time in Pacific Time (PST/PDT automatically adjusted)
    const currentTime = moment().tz("America/Los_Angeles");

    // Extract the hour
    const currentHour = currentTime.hour();

    // Define business hours (9 AM - 5 PM PST, GMT-7)
    const startHour = 9;
    const endHour = 17;

    let response = {
        inHours: false // Default to false (after hours)
    };

    if (currentHour >= startHour && currentHour < endHour) {
        response.inHours = true; // 9 AM - 5 PM (Business hours)
    }

    callback(null, response);
};
