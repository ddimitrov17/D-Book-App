const { db } = require('../database/database');

async function createReview(req, res) {
    try {
        const { review_content, book_photo, book_title, book_author } = req.body;
        const creator_id = req.user.id;
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

async function getReadingListAndFavorites(req, res) {
    const creator_id = req.user.id;
    try {
        const readingListAndFavoritesQuery = `
        SELECT reading_list, favorites
        FROM users
        WHERE id = $1
        `;

        const readingListAndFavoritesResult = await db.query(readingListAndFavoritesQuery, [creator_id]);
        res.status(200).json(readingListAndFavoritesResult.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getReviewsInFeed(req, res) {
    try {
        const reviewsForFeed = await db.query(
            'SELECT * FROM reviews WHERE creator_id != $1',
            [req.user.id]
        );

        for (let i=0;i<reviewsForFeed.rows.length;i++) {
            const creatorId = reviewsForFeed.rows[i].creator_id;
            const creatorQuery = `
            SELECT username
            FROM users
            WHERE id = $1
            `;
            const creatorResult = await db.query(creatorQuery, [creatorId]);
            reviewsForFeed.rows[i].creator = {
                username: creatorResult.rows[0].username,
            }
        }
        res.status(201).json(reviewsForFeed.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    createReview,
    getReadingListAndFavorites,
    getReviewsInFeed
}