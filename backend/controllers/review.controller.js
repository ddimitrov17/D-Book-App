const { db } = require('../database/database');

async function createReview(req, res) {
    try {
        const { review_content, book_photo, book_title, book_author, book_id } = req.body;
        const creator_id = req.user.id;
        const newReview = await db.query(
            'INSERT INTO reviews (review_content, creator_id, book_photo, book_title, book_author, book_id ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [review_content, creator_id, book_photo, book_title, book_author, book_id]
        );

        res.status(201).json({
            message: "Post creation done"
        });
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

async function addOrRemoveToReadingList(req,res) {
    try {
        const { book_id } = req.body;
        const creator_id = req.user.id;
        const user = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [creator_id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const readingList = user.rows[0].reading_list;
        const readingListArray = readingList ? readingList.split(",") : [];

        if (readingListArray.includes(book_id)) {
            readingListArray.splice(readingListArray.indexOf(book_id), 1);
        } else {
            readingListArray.push(book_id);
        }

        const updatedReadingList = readingListArray.join(",");
        await db.query(
            'UPDATE users SET reading_list = $1 WHERE id = $2',
            [updatedReadingList, creator_id]
        );

        res.status(200).json({
            message: "Reading list updated successfully",
        });
    } catch (err) {
        console.error("Error updating reading list:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function addOrRemoveToFavoritesShelf(req,res) {
    try {
        const { book_id } = req.body;
        const creator_id = req.user.id;
        const user = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [creator_id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const favoritesList = user.rows[0].favorites_shelf;
        const favoritesListArray = favoritesList ? favoritesList.split(",") : [];

        if (favoritesListArray.includes(book_id)) {
            favoritesListArray.splice(favoritesListArray.indexOf(book_id), 1);
        } else {
            favoritesListArray.push(book_id);
        }

        const updatedFavoritesList = favoritesListArray.join(",");
        await db.query(
            'UPDATE users SET favorites_shelf = $1 WHERE id = $2',
            [updatedFavoritesList, creator_id]
        );

        res.status(200).json({
            message: "Favorites shelf updated successfully",
        });
    } catch (err) {
        console.error("Error updating favorites shelf:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getStateOfReadingAndFavorites(req,res) {
    try {
        const book_id = req.params.id;
        const creator_id = req.user.id;
        const user = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [creator_id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const readingList = user.rows[0].reading_list;
        const readingListArray = readingList ? readingList.split(",") : [];

        const favoritesList = user.rows[0].favorites_shelf;
        const favoritesListArray = favoritesList ? favoritesList.split(",") : [];

        const readingListState = readingListArray.includes(book_id);
        const favoritesListState = favoritesListArray.includes(book_id);

        res.status(200).json({
            readingListState,
            favoritesListState,
        });
    } catch (err) {
        console.error("Error getting state of reading and favorites:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getReadingList(req, res) {
    const creator_id = req.user.id;
    try {
        const user = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [creator_id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const readingList = user.rows[0].reading_list;
        const readingListArray = readingList ? readingList.split(",") : [];

        res.status(200).json(readingListArray);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getFavoritesShelf(req, res) {
    const creator_id = req.user.id;
    try {
        const user = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [creator_id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const favoritesShelf = user.rows[0].favorites_shelf;
        const favoritesShelfArray = favoritesShelf ? favoritesShelf.split(",") : [];

        res.status(200).json(favoritesShelfArray);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    createReview,
    getReviewsInFeed,
    getReviewsOfUser,
    getReviewById,
    updateReview,
    deleteReview,
    addOrRemoveToReadingList,
    addOrRemoveToFavoritesShelf,
    getStateOfReadingAndFavorites,
    getReadingList,
    getFavoritesShelf
}