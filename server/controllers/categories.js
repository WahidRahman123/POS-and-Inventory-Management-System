const Category = require('../models/Category');

module.exports.index = async (req, res) => {
    try {
        const category = await Category.find({});

        res.status(201).json(category);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.indexWithLimit = async (req, res) => {
    try {
        const limitValue = parseInt(req.query.l);
        const category = await Category.find({}).limit(limitValue);

        res.status(201).json(category);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const category = new Category({ 
            name
         });

        await category.save();
    
        res.status(201).json({message: "Category created successfully."})
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}


module.exports.showCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        res.status(201).json(category);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const category = await Category.findById(id);

        if(category) {
            category.name = name || category.name;

            await category.save();

            res.status(201).json({message: 'Category updated successfully'});

        } else {
            res.status(404).json({message: "Category not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {

            await category.deleteOne();
            res.status(201).json({message: "Category removed"});

        } else {
            res.status(404).json({message: "Category not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports.searchCategory = async (req, res) => {
    try {
        const query = req.query.q;

        const category = await Category.find({ name: {$regex: query, $options: 'i'} });

        if(category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({message: "Category not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}