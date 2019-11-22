/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  app
    .route("/api/books")
    .get(function(req, res) {
      db.collection("books")
        .find({})
        .toArray((err, data) => {
          if (err) {
            res.send("Something went wrong. Could not retrieve books.");
          } else {
            res.send(data);
          }
        });
    })

    .post(function(req, res) {
      // req.body = {title: 'title'};
      if (!req.body.title) {
        res.send("Please enter a title.");
      } else {
        db.collection("books").insertOne(
          {
            title: req.body.title,
            commentcount: 0,
            comments: []
          },
          (err, data) => {
            if (err) {
              res.send("Something went wrong. Book not added.");
            } else {
              res.send(data.ops[0]);
            }
          }
        );
      }
    })

    .delete(function(req, res) {
      db.collection("books").deleteMany({}, (err, data) => {
        if (err) {
          res.send("Something went wrong. Could not delete books.");
        } else {
          res.send("complete delete successful");
        }
      });
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      db.collection("books").findOne(
        { _id: ObjectID(req.params.id) },
        (err, data) => {
          if (err) {
            res.send("Something has gone horribly awry.");
          } else {
            if (data) {
              res.send(data);
            } else {
              res.send('no book exists');
            }
          }
        }
      );
    })

    .post(function(req, res) {
      if (req.body.comment) {
        db.collection("books").findOneAndUpdate(
          { _id: ObjectID(req.params.id) },
          {
            $push: { comments: req.body.comment },
            $inc: { commentcount: 1 }
          },
          { returnOriginal: false },
          (err, data) => {
            if (err) {
              res.send(`Unable to update book with id ${req.params.id}`);
            } else {
              res.send(data.value);
            }
          }
        );
      } else {
        res.send("Cannot submit without a comment.");
      }
    })

    .delete(function(req, res) {
      db.collection("books").deleteOne(
        { _id: ObjectID(req.params.id) },
        (err, data) => {
          if (err) {
            res.send(`Unable to delete book with id ${req.params.id}`);
          } else {
            res.send("delete successful");
          }
        }
      );
    });
};
