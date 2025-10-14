const Customer = require("../models/Customer");
const Decimal = require("decimal.js");

module.exports.index = async (req, res) => {
  try {
    const { page = 1, order = 1 } = req.query;

    const limit = 15;

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const customers = await Customer.find({})
      .sort({ createdAt: parseInt(order) })
      .skip(skip)
      .limit(limit);

    // Count total Customer
    const total = await Customer.countDocuments({});

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      customers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.customersForPOS = async (req, res) => {
  try {
    const customers = await Customer.find({});

    res.status(201).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createCustomer = async (req, res) => {
  const { name, phone, email, address } = req.body;

  try {
    const customer = new Customer({
      name,
      phone,
      email,
      address
    });

    await customer.save();

    res.status(201).json({ message: "Customer created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;

    try {
        const customer = await Customer.findById(id);

        if(customer) {
            customer.name = name || customer.name;
            customer.phone = phone || customer.phone;
            customer.email = email || customer.email;
            customer.address = address || customer.address;

            await customer.save();

            res.status(201).json({message: 'Customer updated successfully'});

        } else {
            res.status(404).json({message: "Customer not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      await customer.deleteOne();
      res.json({ message: "Customer deleted successfully" });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

