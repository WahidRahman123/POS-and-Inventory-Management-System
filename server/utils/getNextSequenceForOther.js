const Counter = require("../models/Counter");

const getNextSequenceForOther = async (name, session = "") => {
  try {
    // const count = await Counter.findOne({ name }).session(session);
    const count = await Counter.findOne({ name });

    if (count) {
      count.seq += 1;
      // await count.save({ session });
      await count.save();
      return { seq: count.seq };
    } else {
      const newCount = new Counter({
        name,
        seq: 1,
        seqChars: [],
      });
      // await newCount.save({ session });
      await newCount.save();

      return { seq: newCount.seq };
    }
  } catch (error) {
    return null;
  }
};

module.exports = { getNextSequenceForOther };
