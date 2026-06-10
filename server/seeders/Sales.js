const axios = require("axios");

const sales = require("../data/sales.json");
// console.log(sales)

const seedSales = async () => {
  try {
    for (const sale of sales) {
      await axios.post(
        "http://localhost:4000/api/sales",
        sale
      );

      console.log(
        "Inserted:",
        sale.customerName
      );
    }

    console.log("DONE");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

seedSales();