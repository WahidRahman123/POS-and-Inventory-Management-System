const Purchase = require("../models/Purchase");
const PurchaseTransaction = require("../models/PurchaseTransaction");
const Supplier = require("../models/Supplier");
const Decimal = require("decimal.js");

module.exports.index = async (req, res) => {
  try {
    const { page = 1, order = 1 } = req.query;

    const limit = 15;

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const suppliers = await Supplier.find({})
      .sort({ createdAt: parseInt(order) })
      .skip(skip)
      .limit(limit);

    // Count total Customer
    const total = await Supplier.countDocuments({});

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      suppliers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.supplierForPurchase = async (req, res) => {
  try {
    const {q} = req.query;
    const suppliers = await Supplier.find({ name: { $regex: q, $options: "i" } });

    res.status(201).json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createSupplier = async (req, res) => {
  const { name, phone, email, address } = req.body;

  try {
    const supplier = new Supplier({
      name,
      phone,
      email,
      address
    });

    await supplier.save();

    res.status(201).json({ message: "Supplier created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;

    try {
        const supplier = await Supplier.findById(id);

        if(supplier) {
            supplier.name = name || supplier.name;
            supplier.phone = phone || supplier.phone;
            supplier.email = email || supplier.email;
            supplier.address = address || supplier.address;

            await supplier.save();

            res.status(201).json({message: 'Supplier updated successfully'});

        } else {
            res.status(404).json({message: "Supplier not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (supplier) {
      await supplier.deleteOne();
      res.json({ message: "Supplier deleted successfully" });
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.purchaseBySupplierName = async (req, res) => {
  try {
    const { page = 1, dateSearch = "", supplierName="" } = req.query;

    let searchQuery = [];
    let nameSearchQuery = { supplierName };
    searchQuery.push(nameSearchQuery);

    let dateSearchQuery;
    // For date search:
    if (dateSearch) {
      const startOfDay = new Date(dateSearch);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dateSearch);
      endOfDay.setHours(23, 59, 59, 999);

      dateSearchQuery = {
        // createdAt: { $gte: startOfDay, $lte: endOfDay },
        date: { $gte: startOfDay, $lte: endOfDay },
      };
      searchQuery.push(dateSearchQuery);
    }

    const mainSearch = { $and: searchQuery };

    // const limit = 10;

    // Pagination
    // const skip = (parseInt(page) - 1) * limit;

    const transactions = await PurchaseTransaction.find(mainSearch)
      .sort({ date: -1 }).populate("purchaseId")
      // .skip(skip)
      // .limit(limit);
    
    // const purchases = await PurchaseTransaction.aggregate([
    //   {
    //     $match: mainSearch
    //   },
    //   {
    //     $unwind: "$transactionRecords"
    //   },
    //   {
    //     $sort: { "transactionRecords.date" : -1 }
    //   }
    // ]);

    // Count total Customer
    // const total = await Purchase.countDocuments(mainSearch);

    const result = await Purchase.aggregate([
      {
        $match: nameSearchQuery
      },
      {
        $group: {
          _id: null,
          totalAmount: {$sum: { $multiply: ['$totalAmount', 10000] }},
          totalPaid: {$sum: { $multiply: ['$paid', 10000] }},
          totalDue: {$sum: { $multiply: ['$due', 10000] }}
        }
      }
    ]);

    // console.log(purchases)

    res.status(201).json({
      // total,
      // page: parseInt(page),
      // pages: Math.ceil(total / limit),
      transactions,
      totalAmount: result.length > 0 ? result[0].totalAmount / 10000 : 0,
      totalPaid: result.length > 0 ? result[0].totalPaid / 10000 : 0,
      totalDue: result.length > 0 ? result[0].totalDue / 10000 : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};