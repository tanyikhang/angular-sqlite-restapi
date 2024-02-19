const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5038;

app.use(express.json());
app.use(cors());

// Specify the path to your SQLite database file
const dbPath = "d:/Database/sqlite-tools-win-x64-3450100/angular.db";

// Connect to SQLite database
const db = new sqlite3.Database(":memory:"); // In-memory database for demonstration purposes
//const db = new sqlite3.Database(dbPath);

// Create a 'todoappcollection' table
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS todoappcollection (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT)");
    console.log("Connected to SQLite database successfully!");

    // Define routes after the database connection is established
    app.get('/api/todoapp/GetNotes', (request, response) => {
        db.all("SELECT * FROM todoappcollection", (err, rows) => {
            if (err) {
                console.error("Error fetching notes:", err);
                response.status(500).json({ error: "Internal Server Error" });
            } else {
                response.json(rows);
            }
        });
    });

    app.post('/api/todoapp/AddNotes', multer().none(), (request, response) => {
        const newNote = request.body.newNote;
        db.run("INSERT INTO todoappcollection (description) VALUES (?)", [newNote], function (err) {
            if (err) {
                console.error("Error adding note:", err);
                response.status(500).json({ error: "Internal Server Error" });
            } else {
                response.json({ message: "Note added successfully", insertedId: this.lastID });
            }
        });
    });

    app.put('/api/todoapp/UpdateNote/:id', multer().none(), (request, response) => {
        const noteId = request.params.id;
        const newDescription = request.body.description;
        db.run("UPDATE todoappcollection SET description = ? WHERE id = ?", [newDescription, noteId], function (err) {
            if (err) {
                console.error("Error updating note:", err);
                response.status(500).json({ error: "Internal Server Error" });
            } else {
                if (this.changes > 0) {
                    response.json({ message: "Note updated successfully" });
                } else {
                    response.status(404).json({ error: "Note not found" });
                }
            }
        });
    });

    app.delete('/api/todoapp/DeleteNote/:id', (request, response) => {
        const noteId = request.params.id;
        db.run("DELETE FROM todoappcollection WHERE id = ?", [noteId], function (err) {
            if (err) {
                console.error("Error deleting note:", err);
                response.status(500).json({ error: "Internal Server Error" });
            } else {
                if (this.changes > 0) {
                    response.json({ message: "Note deleted successfully" });
                } else {
                    response.status(404).json({ error: "Note not found" });
                }
            }
        });
    });

    app.get('/api/todoapp/SearchNotes', (request, response) => {
        const searchTerm = request.query.term;
        const query = "SELECT * FROM todoappcollection WHERE description LIKE ?";
        const searchTermPattern = `%${searchTerm}%`;
        db.all(query, [searchTermPattern], (err, rows) => {
            if (err) {
                console.error("Error searching notes:", err);
                response.status(500).json({ error: "Internal Server Error" });
            } else {
                response.json(rows);
            }
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
});