const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// POST borrow a book
router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      bookId,
      bookTitle,
      bookImage,
      userEmail,
      borrowDate,
      returnDate,
    } = req.body;

    if (
      !bookId ||
      !bookTitle ||
      !bookImage ||
      !userEmail ||
      !borrowDate ||
      !returnDate
    ) {
      return res.status(400).json({
        message: "Please provide all borrowing information",
      });
    }

    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    const parsedBorrowDate = new Date(borrowDate);
const parsedReturnDate = new Date(returnDate);

if (
  Number.isNaN(parsedBorrowDate.getTime()) ||
  Number.isNaN(parsedReturnDate.getTime()) ||
  parsedReturnDate <= parsedBorrowDate
) {
  return res.status(400).json({
    message: "Please provide valid borrowing and return dates",
  });
}

    const book = await db.collection("books").findOne({
      _id: new ObjectId(bookId),
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const existingBorrow = await db.collection("borrows").findOne({
  bookId: new ObjectId(bookId),
  userEmail: userEmail.toLowerCase(),
});

if (existingBorrow) {
  return res.status(409).json({
    message: "You have already borrowed this book",
  });
}

    const newBorrow = {
      bookId: new ObjectId(bookId),
      bookTitle,
      bookImage,
      userEmail: userEmail.toLowerCase(),
      borrowDate:  parsedBorrowDate,
      returnDate: parsedReturnDate,
      createdAt: new Date(),
    };

    const result = await db.collection("borrows").insertOne(newBorrow);

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to borrow book" });
  }
});

// GET current user's borrowed books
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "User email is required",
      });
    }

    const borrows = await db
      .collection("borrows")
      .find({ userEmail: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrowed books" });
  }
});

// DELETE / return a borrowed book
router.delete("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { email } = req.query;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid borrow ID" });
    }

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const result = await db.collection("borrows").deleteOne({
      _id: new ObjectId(id),
      userEmail: email.toLowerCase(),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Borrow record not found",
      });
    }

    res.json({
      success: true,
      message: "Book returned successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to return book" });
  }
});

module.exports = router;