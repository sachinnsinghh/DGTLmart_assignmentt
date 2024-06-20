const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors({
    // origin: 'http://localhost:5173'
}));
const PORT = 8000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number
});

// Create text index on title and description
CourseSchema.index({ title: 'text', description: 'text' });

const Course = mongoose.model('Course', CourseSchema);

app.use(express.json());

app.post('/courses', async (req, res) => {
    const { title, description, price } = req.body;
    const newCourse = await Course.create({
        title,
        description,
        price,
    });
    res.json({
        message: 'Course created successfully', courseId: newCourse._id
    });
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    console.log("Search query:", query); // Log the search query for debugging

    try {
        const results = await Course.find({ $text: { $search: query } });
        console.log("Search results:", results); // Log the search results for debugging
        res.json(results);
    } catch (error) {
        console.error("Error during search:", error); // Log any errors that occur
        res.status(500).json({ message: 'Error searching courses', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on the port: ${PORT}`);
});
