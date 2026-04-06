const Counter = require('../models/Counter');

const getNextSequenceForSale = async (session) => {
  try {
    const count = await Counter.findOne({ name: "sales" }).session(session);

    if (count) {
      if (count.seq !== 1000) {
        count.seq += 1;
      } else {
        count.seq = 1;
        const length = count.seqChars.length;
        if (count.seqChars[length - 1] !== "z") {
          const str = String.fromCharCode(
            count.seqChars[length - 1].charCodeAt(0) + 1,
          );

          count.seqChars[length - 1] = str;
        } else {
          count.seqChars.push("a");
        }
      }

      await count.save({ session });
      return { seq: count.seq, seqChars: count.seqChars };
    } else {
      const newCount = new Counter({
        name: "sales",
        seq: 1,
        seqChars: ["a"],
      });
      await newCount.save({ session });

      return { seq: newCount.seq, seqChars: newCount.seqChars };
    }
  } catch (error) {
    return null;
  }
};

module.exports = { getNextSequenceForSale };