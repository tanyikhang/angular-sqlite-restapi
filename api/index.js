const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 5038;

app.use(express.json());
app.use(cors());

// Specify the path to your SQLite database file
const dbPath = "d:/Database/sqlite-tools-win-x64-3450100/angular.db"; //sqlite3 database path


// Initialize Sequelize with SQLite database connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    //storage: dbPath,
    logging: false // disable logging to console
});

// Define the TodoAppCollection model
const TodoAppCollection = sequelize.define('TodoAppCollection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.TEXT
    }
});

// Synchronize the model with the database
(async () => {
    try {
        await sequelize.sync();
        console.log("Models synchronized with database successfully!");
    } catch (error) {
        console.error("Error synchronizing models:", error);
    }
})();

// Define routes after the database connection is established
app.get('/api/todoapp/GetNotes', async (request, response) => {
    try {
        const notes = await TodoAppCollection.findAll();
        response.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/todoapp/AddNotes', multer().none(), async (request, response) => {
    const newNote = request.body.newNote;
    try {
        const createdNote = await TodoAppCollection.create({ description: newNote });
        response.json({ message: "Note added successfully", insertedId: createdNote.id });
    } catch (error) {
        console.error("Error adding note:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.put('/api/todoapp/UpdateNote/:id', multer().none(), async (request, response) => {
    const noteId = request.params.id;
    const newDescription = request.body.description;
    try {
        const [updatedRowsCount] = await TodoAppCollection.update({ description: newDescription }, { where: { id: noteId } });
        if (updatedRowsCount > 0) {
            response.json({ message: "Note updated successfully" });
        } else {
            response.status(404).json({ error: "Note not found" });
        }
    } catch (error) {
        console.error("Error updating note:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete('/api/todoapp/DeleteNote/:id', async (request, response) => {
    const noteId = request.params.id;
    try {
        const deletedRowsCount = await TodoAppCollection.destroy({ where: { id: noteId } });
        if (deletedRowsCount > 0) {
            response.json({ message: "Note deleted successfully" });
        } else {
            response.status(404).json({ error: "Note not found" });
        }
    } catch (error) {
        console.error("Error deleting note:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/todoapp/SearchNotes', async (request, response) => {
    const searchTerm = request.query.term;
    try {
        const notes = await TodoAppCollection.findAll({
            where: {
                description: {
                    [Sequelize.Op.like]: `%${searchTerm}%`
                }
            }
        });
        response.json(notes);
    } catch (error) {
        console.error("Error searching notes:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/todoapp/GetNoteById/:id', async (request, response) => {
    const noteId = request.params.id;
    try {
        const note = await TodoAppCollection.findOne({ where: { id: noteId } });
        if (note) {
            response.json(note);
        } else {
        }
    } catch (error) {
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});