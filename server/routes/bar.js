import express from 'express';
import { BarType } from '../models/Type.js';
import { Bar } from '../models/Bar.js';

const router = express.Router();

router.post('/add_tag', async (req, res) => {
    const { tag } = req.body;

    if (!tag) {
        return res.status(400).json({ error: 'Tag is required' });
    }

    try {
        // Check if the tag already exists
        const existingTag = await BarType.findOne({ name: tag });
        if (existingTag) {
            return res.status(400).json({ error: 'Tag already exists' });
        }

        // Create a new tag
        const newTag = new BarType({ name: tag });
        await newTag.save();

        res.status(201).json({ message: 'Tag added successfully', tag: newTag });
    } catch (error) {
        console.error('Error adding tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/tags', async (req, res) => {
    try {
        const tags = await BarType.find();
        if (!tags) {
            return res.json({ status: false, message: "No tags found" });
        }
        const tagsData = tags.map(tag => tag);
        return res.json({ status: true, data: tagsData });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/delete_tag/:id', async (req, res) => {
    const tagId = req.params.id;

    try {
        // Vérifier si le tag existe
        const existingTag = await BarType.findById(tagId);


        // Supprimer le tag
        await BarType.findByIdAndDelete(tagId);

        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/add_bar', async (req, res) => {
    const { name, location, description, types, opening_hours, closing_hours, average_rating } = req.body;

    // Check if all required fields are provided
    if (!name || !location || !opening_hours || !closing_hours) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    try {
        // Check if the bar already exists
        const existingBar = await Bar.findOne({ name });
        if (existingBar) {
            return res.status(400).json({ error: 'Bar already exists' });
        }

        // Create a new bar
        const newBar = new Bar({
            name,
            location,
            description,
            types,
            opening_hours,
            closing_hours,
            average_rating
        });
        await newBar.save();

        res.status(201).json({ message: 'Bar added successfully', bar: newBar });
    } catch (error) {
        console.error('Error adding bar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



export { router as BarRouter };
