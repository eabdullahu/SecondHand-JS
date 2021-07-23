const express = require('express');
const { is_auth } = require('../../../middleware/auth');
const category = require('../../../models/category');


const router = express.Router();

// GET category
router.get('/', async(req, res) => {
    try {
        const query = req.query;
        var filter = { is_active: true };

        if (query.parentId != undefined) {
            filter.parentId = query.parentId;
        }
        if (query.is_under_homepage != undefined) {
            filter.is_under_homepage = query.is_under_homepage;
        }
        if (query.is_active != undefined) {
            filter.is_active = query.is_active;
        }
        const data = await category.find(filter).sort({ 'order': 1 }).populate({
            path: 'children',
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

// router.get('/', async(req, res) => {
//     try {
//         const query = req.query;
//         var filter = { is_active: true };

//         if (query.parentId != undefined) {
//             filter.parentId = query.parentId;
//         }
//         if (query.is_active != undefined) {
//             filter.is_active = query.is_active;
//         }
//         const data = await category.find(filter).populate({
//             path:  'children', 
//             populate: {
//                 path: 'children',
//                 model: 'Category'
//             }
//         });;
//         res.json(data);
//     } catch (error) {
//         res.json({ message: error });
//     }
// });

router.post('/', async(req, res) => {
    try {
        const body = req.body;
        const new_category = new category({
            name: body.name,
            parentId: body.parentId,
            subParentId: body.subParentId,
            order: body.order,
            photo_name: body.photo_name,
            is_active: body.is_active,
            is_under_homepage: body.is_under_homepage
        });

        res.json(await new_category.save());
    } catch (error) {
        res.json({ message: error });
    }
});


module.exports = router;