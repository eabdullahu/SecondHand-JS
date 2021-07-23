const express = require('express');
const { is_auth } = require('../../../middleware/auth');
const product = require('../../../models/product');
const multer = require("multer");
const mime = require('mime-types')
const router = express.Router();
const mongoose = require('mongoose');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './client/src/assets/products')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + '.' + mime.extension(file.mimetype))
    }
})

var upload = multer({ storage: storage })

router.get('/session-products', async(req, res) => {
    try {
        var session_data = req.session.session_products;
        res.json(session_data);
    } catch (error) {
        res.json({ message: error });
    }
});

// GET product
router.get('/', async(req, res) => {
    try {
        const products = await product.find();
        res.json(products);
    } catch (error) {
        res.json({ message: error });
    }
});

//GET product based search

router.post('/search/', async(req, res) => {

    try {


        const keyword = req.body.keyword;
        const category = req.body.category;
        const limit = req.body.limit || 0;
        const page = req.body.page || 0;
        const priceSort = req.body.price;
        const gender = req.body.gender;
        const priceRange = req.body.priceRange;


        var filter = { is_active: true };
        if (keyword != undefined && keyword != '') filter.title = { $regex: '.*' + keyword + '.*', "$options": "i" };
        if (category != undefined && category != '') filter.category = mongoose.Types.ObjectId(category);
        if (gender != undefined && gender != '') filter.gender = gender;
        if (priceRange[0] != null && priceRange[0] != undefined) filter.price = { $gte: priceRange[0] * 100, $lte: priceRange[1] * 100 };

        const no = await product.countDocuments(filter);
        const products = await product.find(filter).skip(page).limit(limit).sort({ price: priceSort });
        delete filter.price;
        const minMax = await product.aggregate([{ $match: filter }, { $group: { _id: null, minValue: { $min: "$price" }, maxValue: { $max: "$price" } } }]);

        res.json({ "products": products, "total": no, "minMax": minMax });
    } catch (error) {
        console.log("Hello Error!");
        res.json({ message: error });
    }

});
router.get("/product_ids", async(req, res) => {
    try {
        const query = req.query;
        console.log(req.query);
        const products = await product.find({ _id: { $in: query.product_ids } });
        res.json(products);
    } catch (error) {
        res.json({ message: error });
    }
});

// GET product
router.get('/products_homepage', async(req, res) => {
    try {
        const query = req.query;
        const products = await product.find().limit(parseInt(query.limit)).sort({ _id: -1 });
        res.json(products);
    } catch (error) {
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




//POST product with image
router.post('/', upload.single('file'), async(req, res) => {
    const prod = JSON.parse(req.body.p);

    photos = {
        photo_name: req.file.filename,
        photo_order: getRandomInt(9999999999999)
    }
    try {
        //gets user from session
        var new_product = new product({
            title: prod.title,
            desc: prod.desc,
            posted_by: req.session.user,
            category: prod.subcategory,
            size: prod.size,
            price: prod.price,
            photos: photos,
            quantity: prod.quantity,
            gender: prod.gender
        })
        var this_product = await new_product.save();
        res.json(this_product);
    } catch (e) {
        console.log(e);
        res.json(e);
    }
});

// GET product
router.get('/mypros', is_auth, async(req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page) || 0;

        const no = await product.find({ posted_by: req.session.user._id, is_active: true });
        const products = await product.find({ posted_by: req.session.user._id, is_active: true }).skip(page).limit(limit);

        var myproducts = [];
        products.forEach(p => {
            myproducts.push({
                _id: p._id,
                title: p.title,
                desc: p.desc,
                category: p.category,
                size: p.size,
                gender: p.gender,
                price: p.price,
                photo: p.photos[0].photo_name,
                quantity: p.quantity

            });
        });
        res.json({ "myproducts": myproducts, "total": no.length });
    } catch (error) {
        res.json({ message: error });
    }
});


router.get('/:product_id', async(req, res) => {
    try {
        const searched_product = await product.findById(req.params.product_id);
        res.json(searched_product);
    } catch (error) {
        res.json({ message: error });
    }
});


router.post('/session-products', async(req, res) => {
    try {
        var session_data = req.session.session_products;
        const new_product = await product.findById(req.body.product_id);
        if (new_product == null) {
            res.send("bad Id");
            return;
        }
        if (session_data != null) {
            var added = false;
            session_data.forEach(function(item, index, array) {
                if (item._id == req.body.product_id) {
                    if (parseInt(item.quantity) + parseInt(req.body.quantity) <= new_product.quantity) {
                        array[index].quantity = parseInt(array[index].quantity) + parseInt(req.body.quantity);
                        array[index].product = new_product;
                    }
                    added = true;
                }
            })
            if (!added) {
                if (parseInt(req.body.quantity) <= new_product.quantity) {
                    session_data.push({ _id: req.body.product_id, quantity: parseInt(req.body.quantity), product: new_product });
                }
            }
        } else {
            var session_data = [];
            if (parseInt(req.body.quantity) <= new_product.quantity) {
                session_data.push({ _id: req.body.product_id, quantity: parseInt(req.body.quantity), product: new_product });
            }
        }
        req.session.session_products = session_data;
        res.json(session_data);
        // res.json(new_product);
    } catch (error) {
        res.json({ message: error });
    }
});

router.post('/update-session-products', async(req, res) => {
    try {
        var session_data = req.session.session_products;
        var update_cart = req.body.update_products;

        session_data.forEach(function(item, index, array) {
            array[index].quantity = parseInt(update_cart[item._id]);
        });

        req.session.session_products = session_data;
        res.json(session_data);
    } catch (error) {
        res.json({ message: error });
    }
});

router.delete('/session-products/:product_id', async(req, res) => {
    try {
        var session_data = req.session.session_products;
        if (session_data != null) {
            session_data.forEach(function(item, index, array) {
                if (item._id == req.params.product_id) {
                    array.splice(index, 1);
                }
            });
        } else {
            res.send("no data!!");
            return;
        }
        req.session.session_products = session_data;
        res.json(session_data);
    } catch (error) {
        res.json({ message: error });
    }
});


router.delete('/:product_id', is_auth, async(req, res) => {
    try {
        const removed = await product.remove({ _id: req.params.product_id });
        res.json(removed);
    } catch (error) {
        res.json({ message: error });
    }
});



router.patch('/:product_id', upload.single('file'), is_auth, async(req, res) => {
    const prod = JSON.parse(req.body.p);

    set_new = {
        title: prod.title,
        sale_status: prod.sale_status,
        discount: prod.discount,
        size: prod.size,
        quantity: prod.quantity,
        desc: prod.desc,
        price: prod.price,
        category: prod.subcategory,
        gender: prod.gender
    }

    if (req.file != null) {

        photo = {
            photo_name: req.file.filename,
            photo_order: getRandomInt(9999999999999)
        }
        set_new.photos = photo
    }

    try {

        const updated = await product.updateOne({ _id: req.params.product_id }, {
            $set: set_new
        });
        res.json(updated);
    } catch (error) {
        res.json({ message: error });
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = router;