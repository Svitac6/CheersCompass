import express from 'express';
import { BarType } from '../models/Type.js';

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



export { router as BarRouter };
