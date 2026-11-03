const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// GET all books
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const books = await db
      .collection("books")
      .find()
      .sort({ dateAdded: -1 })
      .toArray();

    res.json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// GET one book
router.get("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await db.collection("books").findOne({
      _id: new ObjectId(id),
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("GET BOOK ERROR:", error);
    res.status(500).json({ message: "Failed to fetch book" });
  }
});

// ADD a book
router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      title,
      author,
      category,
      image,
      description,
      addedByName,
      addedByEmail,
    } = req.body;

    if (
      !title ||
      !author ||
      !category ||
      !image ||
      !description ||
      !addedByName ||
      !addedByEmail
    ) {
      return res.status(400).json({
        message: "Please provide all required book information",
      });
    }

    const newBook = {
      title,
      author,
      category,
      image,
      description,
      addedByName,
      addedByEmail,
      dateAdded: new Date(),
    };

    const result = await db.collection("books").insertOne(newBook);

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("ADD BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
});

// UPDATE a book
router.patch("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const allowedFields = [
      "title",
      "author",
      "category",
      "image",
      "description",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({
      success: true,
      message: "Book updated successfully",
    });
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);
    res.status(500).json({ message: "Failed to update book" });
  }
});

 // DELETE a book
router.delete("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const result = await db.collection("books").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);
    res.status(500).json({ message: "Failed to delete book" });
  }
});

module.exports = router;
