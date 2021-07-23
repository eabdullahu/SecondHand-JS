const express = require('express');
const banner_content = require('../../../../models/banner_content');
const category = require('../../../../models/category');
const router = express.Router();
const multer = require("multer");
const mime = require('mime-types');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './client/src/assets/banner')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + '.' + mime.extension(file.mimetype))
    }
})
var upload = multer({ storage: storage })

// GET content
router.get('/', async(req, res) => {
    try {
        const content = await banner_content.find().populate({
            path:  'category', 
            model: 'Category' 
        });
        const cat = await category.find({ is_active: true }).select("_id, name")
        res.json({ banners: content, category: cat });
    } catch (error) {
        res.json({ message: error });
    }
});

// POST content
router.post('/', upload.single('file'), async(req, res) => {
    try {
        const banner = JSON.parse(req.body.banner);
        console.log(banner);
        const new_banner = {
            name: banner.title,
            order: banner.order,
            photo_name: req.file.filename,
            category: banner.category
        }
        const bn = new banner_content(new_banner);
        const add_banner = await bn.save()

        res.send("success");
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// UPDATE BANNER
router.patch('/:id', upload.single('file'), async(req, res) => {
    try {
        const bn = JSON.parse(req.body.banner);
        const ct = {
            name: bn.title,
            order: bn.order,
            category: bn.category
        }

        if(req.file) bn.photo_name = req.file.filename

        await banner_content.updateOne({ _id: req.params.id }, ct );
        res.send("success");
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// DELETE BANNER
router.delete('/:id', async(req, res) => {
    try {
        await banner_content.deleteOne({ _id: req.params.id });
        res.send("success");
    } catch (error) {
        console.log("eRR", error)
        res.json({ message: error });
    }
});

module.exports = router;