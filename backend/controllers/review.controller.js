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

async function getReviewsOfUser(req,res) {
    try {
        const reviewsOfUser = await db.query(
            'SELECT * FROM reviews WHERE creator_id = $1',
            [req.user.id]
        );

        res.status(201).json(reviewsOfUser.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getReviewById(req,res) {
    try {
        const reviewId = req.params.id;
        const reviewById = await db.query(
            'SELECT * FROM reviews WHERE id = $1',
            [reviewId]
        );

            const creatorId = reviewById.rows[0].creator_id;
            const creatorQuery = `
            SELECT username
            FROM users
            WHERE id = $1
            `;
            const creatorResult = await db.query(creatorQuery, [creatorId]);
            reviewById.rows[0].creator = {
                username: creatorResult.rows[0].username,
            }

        res.status(201).json(reviewById.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function updateReview(req, res) {
    try {
        const reviewId = req.params.id; 
        const { review_content } = req.body; 

        if (!review_content || review_content.trim() === "") {
            return res.status(400).json({ error: "Review content cannot be empty" });
        }

        const result = await db.query(
            'UPDATE reviews SET review_content = $1 WHERE id = $2 AND creator_id = $3 RETURNING *',
            [review_content, reviewId, req.user.id] 
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Review not found or not authorized" });
        }

        res.status(200).json({
            review: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating review:", error.message); 
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function deleteReview(req,res) {
    try {
        const reviewId = req.params.id;
        const result = await db.query(
            'DELETE FROM reviews WHERE id = $1 AND creator_id = $2',
            [reviewId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Review not found or not authorized" });
        }

        res.status(200).json({
            message: "Review deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    createReview,
    getReadingListAndFavorites,
    getReviewsInFeed,
    getReviewsOfUser,
    getReviewById,
    updateReview,
    deleteReview
}