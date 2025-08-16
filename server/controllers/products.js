const Category = require('../models/Category');
const Product = require('../models/Product');

module.exports.index = async (req, res) => {
    try {
        const limitValue = parseInt(req.query.l);
        const product = await Product.find({}).limit(limitValue).populate('category');

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

module.exports.createProduct =  async (req, res) => {
    try {
        const { name, sellPrice, costPrice, quantity, categoryName } = req.body;

        // search the category in category
        let categorySearch = await Category.findOne({ name: categoryName });

        const product = new Product({ 
            name,
            sellPrice,
            costPrice,
            quantity,
            category: categorySearch._id
        });

        const createdProduct = await product.save();
        res.status(201).json({message: 'Item Added Successfully!'});

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

module.exports.showProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category');

        res.status(201).json(product);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, sellPrice, costPrice, quantity, categoryName } = req.body;

    try {
        const product = await Product.findById(id);

        // search the category in category
        let categorySearch = await Category.findOne({ name: categoryName });

        if(product) {
            product.name = name || product.name;
            product.sellPrice = sellPrice || product.sellPrice;
            product.costPrice = costPrice || product.costPrice;
            product.quantity = quantity || product.quantity;
            product.category = categorySearch._id || product.category;

            await product.save();

            res.status(201).json({message: 'Product updated successfully'});

        } else {
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {

            await product.deleteOne();
            res.status(201).json({message: "Product removed"});

        } else {
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.searchProduct = async (req, res) => {
    try {
        const query = req.query.q;

        const product = await Product.find({ name: {$regex: query, $options: 'i'} });

        if(product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.quantityOfProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = await Product.findById(id, { quantity: 1, _id: 0 });

        res.status(200).json({ quantity });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.addStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const product = await Product.findById(id);

        product.quantity = product.quantity + quantity;
        product.save();
        res.status(200).json({ message: "Stock Add Successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}