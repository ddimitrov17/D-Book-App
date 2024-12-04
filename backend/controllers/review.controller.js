const { db } = require('../database/database');

async function createReview(req, res) {
    try {
        const { review_content, book_photo, book_title, book_author } = req.body;
        const creator_id = req.user.id;
        console.log(review_content)
        const newReview = await db.query(
            'INSERT INTO reviews (review_content, creator_id, book_photo, book_title, book_author ) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [review_content, creator_id, book_photo, book_title, book_author]
        );

        res.status(201).json({
            message: "Post creation done"
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    createReview
}