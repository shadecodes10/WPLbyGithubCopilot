const express = require('express');
const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { customerId, restaurantId, menuItemId, rating, comment, images } = req.body;
    const review = new Review({ customer: customerId, restaurant: restaurantId, menuItem: menuItemId, rating, comment, images });
    await review.save();

    const reviews = await Review.find({ menuItem: menuItemId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await MenuItem.findByIdAndUpdate(menuItemId, { rating: avgRating });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId }).populate('customer');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;