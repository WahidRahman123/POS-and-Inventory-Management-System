const dayjs = require("./date.js");

const combineDateWithCurrentTime = (date) => {
  const now = dayjs().tz("Asia/Dhaka");

  return dayjs(date)
    .tz("Asia/Dhaka")
    .hour(now.hour())
    .minute(now.minute())
    .second(now.second())
    .millisecond(now.millisecond())
    .utc()
    .toDate();
};

module.exports = {
  combineDateWithCurrentTime,
};