const dayjs = require("dayjs");
const Category = require("../models/Category");
const Product = require("../models/Product");
const ProductStatement = require("../models/ProductStatement");

module.exports.index = async (req, res) => {
  try {
    const { page = 1, search = "", order = 1 } = req.query;

    const limit = 15;

    // Search Filter
    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const products = await Product.find(searchQuery)
      .sort({ createdAt: parseInt(order) })
      .skip(skip)
      .limit(limit)
      .populate("category");

    // Count total documents
    const total = await Product.countDocuments(searchQuery);

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
module.exports.allProductsForSalesReturnPayment = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(201).json({
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createProduct = async (req, res) => {
  try {
    const { name, sellPrice, costPrice, quantity, categoryName, userId } = req.body;

    const now = dayjs()
      .tz("Asia/Dhaka")
      .utc()
      .toDate();

    // search the category in category
    let categorySearch = await Category.findOne({ name: categoryName });

    const product = new Product({
      name,
      sellPrice,
      costPrice,
      quantity,
      category: categorySearch._id,
    });

    const createdProduct = await product.save();

    //* Product Statement Creation
    const payload = {
      productId: createdProduct._id,
      productName: createdProduct.name,

      transactionType: "Add Product",

      previousQuantity: 0,
      quantityAmount: Number(quantity),
      CurrentQuantity: Number(quantity),

      status: "created",

      date: now,
      userId,
    }

    const productStatement = new ProductStatement(payload);
    await productStatement.save();

    res.status(201).json({ message: "Item Added Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.showProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, sellPrice, costPrice, quantity, categoryName, userId } = req.body;
  const now = dayjs()
    .tz("Asia/Dhaka")
    .utc()
    .toDate();

  try {
    const product = await Product.findById(id);

    const previousQuantity = product.quantity;
    const mainQuantity = Number(product.quantity) - Number(quantity);

    let status = "";
    if (mainQuantity > 0) {
      status = "decreased"
    } else if (mainQuantity < 0) {
      status = "increased"
    } else if (mainQuantity === 0) {
      status = "unchanged"
    }

    // search the category in category
    let categorySearch = await Category.findOne({ name: categoryName });

    if (product) {
      product.name = name || product.name;
      product.sellPrice = sellPrice || product.sellPrice;
      product.costPrice = costPrice || product.costPrice;
      product.quantity = quantity || product.quantity;
      product.category = categorySearch._id || product.category;

      await product.save();

      //* Product Statement Creation
      const payload = {
        productId: product._id,
        productName: product.name,

        transactionType: "Update Product",

        previousQuantity,
        quantityAmount: Number(Math.abs(mainQuantity)),
        CurrentQuantity: product.quantity,

        status,

        date: now,
        userId,
      }

      const productStatement = new ProductStatement(payload);
      await productStatement.save();

      res.status(201).json({ message: "Product updated successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.status(201).json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchProduct = async (req, res) => {
  try {
    const query = req.query.q;

    const product = await Product.find({
      name: { $regex: query, $options: "i" },
    }).populate("category");

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchProductForPOS = async (req, res) => {
  try {
    const query = req.query.q;

    const product = await Product.find({
      name: { $regex: query, $options: "i" },
      quantity: { $gt: 0 },
    }).populate("category");

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchProductForPurchase = async (req, res) => {
  try {
    const query = req.query.q;

    const product = await Product.find({
      name: { $regex: query, $options: "i" },
      // quantity: { $gt: 0 },
    }).populate("category");

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.quantityOfProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = await Product.findById(id, { quantity: 1, _id: 0 });

    res.status(200).json({ quantity });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, userId } = req.body;
    const product = await Product.findById(id);

    const previousQuantity = product.quantity;

    product.quantity = product.quantity + quantity;
    product.save();

    const now = dayjs()
      .tz("Asia/Dhaka")
      .utc()
      .toDate();

    //* Product Statement Creation
    const payload = {
      productId: product._id,
      productName: product.name,

      transactionType: "Add Stock",

      previousQuantity,
      quantityAmount: Number(quantity),
      CurrentQuantity: product.quantity,

      status: "increased",

      date: now,
      userId,
    }

    const productStatement = new ProductStatement(payload);
    await productStatement.save();


    res.status(200).json({ message: "Stock Add Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.productLowQuantityCheck = async (req, res) => {
  try {
    const countRes = await Product.aggregate([
      {
        $match: { quantity: { $lt: 10 } },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      count: countRes.length > 0 ? countRes[0].count : 0,
    };
    // console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.lowQuantityProductList = async (req, res) => {
  try {
    const { page = 1, order = 1 } = req.query;

    const limit = 15;

    const searchQuery = { quantity: { $lt: 10 } }

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const products = await Product.find(searchQuery)
      .sort({ createdAt: parseInt(order) })
      .skip(skip)
      .limit(limit)
      .populate("category");

    // Count total documents
    const total = await Product.countDocuments(searchQuery);

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
