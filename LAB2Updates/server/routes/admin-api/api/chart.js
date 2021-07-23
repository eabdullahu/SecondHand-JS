const express = require('express');
// const { is_auth, is_admin } = require('../../../../middleware/auth');
const product = require('../../../../models/product');
const orders = require('../../../../models/order');
const user = require('../../../../models/user');

const router = express.Router();




// users
router.post('/user_demography', async(req, res) => {
    try {
        const user_data = await user.aggregate(
            [
                {
                    '$group': {
                        '_id': {
                            'date': {
                                '$dateToString': {
                                    'format': '%Y-%m-%d',
                                    'date': '$created_at'
                                }
                            },
                            'city': '$city'
                        },
                        'count': {
                            '$sum': 1
                        }
                    }
                }, {
                '$lookup': {
                    'from': 'cities',
                    'localField': '_id.city',
                    'foreignField': '_id',
                    'as': '_id.city'
                }
            }, {
                '$unwind': {
                    'path': '$_id.city'
                }
            }, {
                '$project': {
                    'name': '$_id.city.name',
                    'count': 1,
                    'date': '$_id.date',
                    '_id': 0
                }
            }, {
                '$sort': {
                    'date': -1
                }
            }
            ]
        );

        let dates = [];
        let datasets = [];
        let labels = [];

        user_data.map(d => {
                let index = datasets.findIndex(x => x.name == d.name);

                if(index === -1) {
                    datasets.push({name: d.name});
                    labels.push(d.name);
                }

                if(dates.indexOf(d.date) === -1) {
                    dates.push(d.date);
                }
            }
        )

        datasets.forEach(c =>{
            c.data =  Array(dates.length).fill(0)
        })

        user_data.forEach(d => {
            datasets.forEach(c =>{
                if(c.name == d.name) c.data[dates.indexOf(d.date)] =  d.count
            })
        });

        res.json({ datasets, dates, labels});
    } catch (error) {
        res.json({ message: error });
    }
});




router.get('/pieChart', async(req, res) => {
    try {
        const data = await product.aggregate([{
            $lookup: {
                'from': 'categories',
                'localField': 'category',
                'foreignField': '_id',
                'as': 'category'
            }
        }, {
            $group: {
                _id: '$category.name',
                'count': {
                    $sum: 1
                }
            }
        }]);
        res.json(data);
    } catch (error) {
        res.json({ message: error });
    }
});



router.get('/lineChart', async(req, res) => {
    try {
        var labels = [];
        var days = [];
        const data = await orders.aggregate([{
            $project: {
                "year": {
                    $year: '$created_at'
                },
                "month": {
                    $month: '$created_at'
                },
                "day": {
                    $dayOfMonth: '$created_at'
                },
                "dayWeek": {
                    $dayOfWeek: "$created_at"
                }
            }
        }, {
            $match: {
                'year': new Date().getFullYear(),
                'month': { $gte: new Date().getMonth() - 2 },
                'day': {
                    $gte: new Date().getDate() - 7
                }
            },
        }, {
            $group: {
                _id: '$dayWeek',
                'count': {
                    $sum: 1
                }
            },
        }]);

        console.log(data);
        for (var key in data) {
            labels.push(dayOfWeek(data[key]._id));
            days.push(data[key].count);

        }
        res.json({ "days": days, "labels": labels });
    } catch (error) {
        res.json({ message: "ERROR KI !" });
    }
});


router.get('/barChart', async(req, res) => {
    try {

        const sold = await product.aggregate([{
            $match: {
                'quantity': 0
            }
        }, {
            $count: 'total'
        }]);

        const available = await product.aggregate([{
            $match: {
                'quantity': { $gt: 0 }
            }
        }, {
            $count: 'total'
        }]);
        res.json({ "stock": sold, "available": available });
    } catch (error) {
        res.json({ message: "ERROR KI !" });
    }
});


function dayOfWeek(day) {
    day = (day % 7) - 1;
    var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return week[day];
}







module.exports = router;