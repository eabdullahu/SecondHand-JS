const express = require('express');
// const { is_auth } = require('../../../middleware/auth');
const product = require('../../../../models/product');
const user = require('../../../../models/user');
const category = require('../../../../models/category');
const reviews = require('../../../../models/review');
const router = express.Router();
const mongoose = require('mongoose');

//POST product based search
router.post('/search', async(req, res) => {

    try {
        const keyword = req.body.keyword;
        const limit = req.body.limit || 0;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const page = req.body.page || 0;
        const gender = req.body.gender;
        const posted_by = req.body.posted_by;
        const category_products = req.body.category;
        const productStatus = req.body.productStatus != 'all' ? req.body.productStatus : '';

        var filter = {};

        if (posted_by != '' && posted_by != null) {
            var posted_user = await user.findOne({ email: posted_by })
            filter.posted_by = mongoose.Types.ObjectId(posted_user._id);
        }
        // return res.json({filter});

        if (productStatus != undefined && productStatus != '') filter.is_active = productStatus;
        if (keyword != undefined && keyword != '') filter.title = { $regex: '.*' + keyword + '.*', "$options": "i" };
        if (gender != undefined && gender != '') filter.gender = gender;

        if ((startDate != null && startDate != '') || (endDate != null && endDate != '')) filter.created_at = {}
        if (startDate != null && startDate != '') filter.created_at['$gte'] = new Date(startDate)
        if (endDate != null && endDate != '') filter.created_at['$lte'] = Date.parse(endDate)

        if (category_products != null && category_products != '') filter.category = category_products

        const no = await product.countDocuments(filter);
        const products_category = await category.find();
        const products = await product.find(filter).skip(page).limit(limit).populate('category');

        res.json({ "products": products, "total": no, category: products_category, "filter": filter });
    } catch (error) {
        console.log("Hello Error!");
        res.json({ message: error });
    }

});

//GET product based on clicked category 
router.get('/category', async(req, res) => {

    try {
        const query = req.query;
        var filter = { is_active: true, category: query.category };
        const products = await product.find(filter);
        res.json(products);
    } catch (error) {
        res.json({ message: error });
    }

});

router.get('/:product_id', async(req, res) => {
    try {
        const searched_product = await product.findById(req.params.product_id).populate('posted_by').populate('category');
        const product_reviews = await reviews.find({ product: req.params.product_id }).populate('posted_by');
        res.json({ searched_product: searched_product, reviews: product_reviews });
    } catch (error) {
        res.json({ message: error });
    }
});

//Get number of product for specific user
router.get('/user/:id', async(req, res) => {
    try {

        const productsNo = await product.find({ posted_by: req.params.id }).countDocuments();
        res.json(productsNo);
    } catch (error) {
        res.json({ message: error });
    }
});

router.patch('/:product_id', async(req, res) => {
    try {
        await product.updateOne({ _id: req.params.product_id }, { $set: { is_active: req.body.is_active } });
        res.json({ message: 'updated' })
    } catch (error) {
        res.json({ message: error });
    }
});


module.exports = router;