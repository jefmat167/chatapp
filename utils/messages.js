const moment = require('moment');

const formatMessage = (username, text) => {
    return {
        username,
        text,
        timestamp: moment().format('h:mm a')
    }
}

module.exports = formatMessage;