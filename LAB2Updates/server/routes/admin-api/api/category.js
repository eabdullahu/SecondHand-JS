const express = require('express');
// const { is_auth } = require('../../../middleware/auth');
const category = require('../../../../models/category');
const router = express.Router();
const multer = require("multer");
const mime = require('mime-types')
const mongoose = require('mongoose');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './client/src/assets/banner')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + '.' + mime.extension(file.mimetype))
    }
})
var upload = multer({ storage: storage })

// GET CATEGORY
router.get('/', async(req, res) => {
    try {
        let query = req.query;

        const data = await category.find(query).populate({
            path:  'children', 
            populate: {
                path: 'children',
                model: 'Category'
            }
        });
        res.json(data);
    } catch (error) {
        res.json({ message: error });
    }
});

// POST CATEGORY
router.post('/', upload.single('file'), async(req, res) => {
    try {
        const cat = JSON.parse(req.body.category);
        const new_category = {
            name: cat.name,
            order: cat.order,
            is_active: cat.is_active,
            is_under_homepage: cat.under_homepage
        }

        if(req.file) new_category.photo_name = req.file.filename
        if(cat.parent == "0") new_category.parentId = 0
        console.log(new_category, cat.parent)
        const ct = new category(new_category);
        const add_category = await ct.save()

        if(cat.parent != "0" && cat.parent != 0){
            if(cat.subparent !== "none"){
                await category.updateOne({_id: cat.subparent}, { $push: { children: add_category._id } });  
            }else {
                await category.updateOne({_id: cat.parent}, { $push: { children: add_category._id } });  
            }
        }

        res.send("success");
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// UPDATE CATEGORY
router.patch('/:id', upload.single('file'), async(req, res) => {
    try {
        const cat = JSON.parse(req.body.category);
        const ct = {
            name: cat.name,
            order: cat.order,
            is_active: cat.is_active,
            is_under_homepage: cat.under_homepage
        }

        if(req.file) ct.photo_name = req.file.filename

        await category.updateOne({ _id: req.params.id }, ct );
        res.send("success");
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// DELETE CATEGORY
router.delete('/:id', async(req, res) => {
    try {
        const body = req.body;
        console.log(body);

        if(body.subparent){
            if(body.subparent2){
                await category.updateOne({_id: body.subparent}, { $pull: { children: body.subparent2 } });
            }else {
                await category.updateOne({_id: body.parent}, { $pull: { children: body.subparent } });
            }
        } 
        await category.deleteOne({ _id: req.params.id });

        res.send("success");
    } catch (error) {
        console.log("eRR", error)
        res.json({ message: error });
    }
});

module.exports = router;