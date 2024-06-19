import express from 'express';
import multer from 'multer';
import { BarType } from '../models/Type.js';
import { Bar } from '../models/Bar.js';
import { Favorite } from '../models/Favorite.js';
import { User } from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { isValidObjectId } from 'mongoose'; 

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route pour ajouter un tag
router.post('/add_tag', async (req, res) => {
    const { tag } = req.body;

    if (!tag) {
        return res.status(400).json({ error: 'Tag is required' });
    }

    try {
        // Vérifier si le tag existe déjà
        const existingTag = await BarType.findOne({ name: tag });
        if (existingTag) {
            return res.status(400).json({ error: 'Tag already exists' });
        }

        // Créer un nouveau tag
        const newTag = new BarType({ name: tag });
        await newTag.save();

        res.status(201).json({ message: 'Tag added successfully', tag: newTag });
    } catch (error) {
        console.error('Error adding tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour récupérer tous les tags
router.get('/tags', async (req, res) => {
    try {
        const tags = await BarType.find();
        if (!tags) {
            return res.json({ status: false, message: 'No tags found' });
        }
        return res.json({ status: true, data: tags });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour supprimer un tag par ID
router.delete('/delete_tag/:id', async (req, res) => {
    const tagId = req.params.id;

    try {
        // Vérifier si le tag existe
        const existingTag = await BarType.findById(tagId);
        if (!existingTag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        // Supprimer le tag
        await BarType.findByIdAndDelete(tagId);

        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour ajouter un bar avec image
router.post('/add_bar', upload.single('image'), async (req, res) => {
    const { name, location, description, types, opening_hours, closing_hours, average_rating } = req.body;
    const image = req.file ? req.file.path : null;

    // Vérifier si tous les champs requis sont fournis
    if (!name || !location || !opening_hours || !closing_hours || !image) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    try {
        // Vérifier si le bar existe déjà
        const existingBar = await Bar.findOne({ name });
        if (existingBar) {
            return res.status(400).json({ error: 'Bar already exists' });
        }

        // Créer un nouveau bar
        const newBar = new Bar({
            name,
            location,
            description,
            rating:0,
            numRating:0,
            types: JSON.parse(types),
            opening_hours,
            closing_hours,
            average_rating,
            image
        });
        await newBar.save();

        res.status(201).json({ message: 'Bar added successfully', bar: newBar });
    } catch (error) {
        console.error('Error adding bar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour supprimer un bar par ID
router.delete('/delete_bar/:id', async (req, res) => {
    const barId = req.params.id;

    try {
        // Vérifier si le bar existe
        const bar = await Bar.findById(barId);
        if (!bar) {
            return res.status(404).json({ error: 'Bar not found' });
        }

        // Supprimer le fichier d'image du serveur
        if (bar.image) {
            fs.unlink(path.resolve(bar.image), err => {
                if (err) {
                    console.error('Error deleting image:', err);
                    return res.status(500).json({ error: 'Error deleting image' });
                }
            });
        }

        // Supprimer le bar de la base de données
        await Bar.findByIdAndDelete(barId);

        res.status(200).json({ message: 'Bar deleted successfully' });
    } catch (error) {
        console.error('Error deleting bar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour récupérer tous les bars avec types populés
router.get('/bars', async (req, res) => {
    try {
        const bars = await Bar.find().populate('types');
        if (!bars) {
            return res.json({ status: false, message: 'No bars found' });
        }
        return res.json({ status: true, data: bars });
    } catch (error) {
        console.error('Error fetching bars:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour récupérer tous les favoris d'un utilisateur
router.get('/favorites/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const favorites = await Favorite.find({ user: userId }).populate('bar');
        res.status(200).json({ status: true, data: favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ status: false, message: 'Failed to fetch favorites' });
    }
});

// Route to check if a bar is liked by a user
router.get('/is_liked/:barId', async (req, res) => {
    try {
        const { userId } = req.query; // Assuming userId is sent as a query parameter
        const { barId } = req.params;
        const favorite = await Favorite.findOne({ user: userId, bar: barId });
        if (favorite) {
            res.status(200).json({ status: true, message: 'Bar is liked by user', isLiked: true });
        } else {
            res.status(200).json({ status: true, message: 'Bar is not liked by user', isLiked: false });
        }
    } catch (error) {
        console.error('Error checking if bar is liked:', error);
        res.status(500).json({ status: false, message: 'Failed to check if bar is liked' });
    }
});



router.post('/like_bar/:barId', async (req, res) => {
    const { userId } = req.body;
    const { barId } = req.params;

    console.log('Received userId:', userId); // Add this line
    console.log('Received barId:', barId);   // Add this line

    if (!userId) {
        return res.status(400).json({ status: false, message: 'User ID is required' });
    }

    try {
        await Favorite.create({ user: userId, bar: barId });
        res.status(200).json({ status: true, message: 'Bar liked successfully' });
    } catch (error) {
        console.error('Error liking bar:', error);
        res.status(500).json({ status: false, message: 'Failed to like bar' });
    }
});


// Route pour disliker un bar
router.delete('/unlike_bar/:barId', async (req, res) => {
    const { userId } = req.body; // Assurez-vous que userId est inclus dans le corps de la requête
    const { barId } = req.params;

    try {
        await Favorite.findOneAndDelete({ user: userId, bar: barId });
        res.status(200).json({ status: true, message: 'Bar unliked successfully' });
    } catch (error) {
        console.error('Error unliking bar:', error);
        res.status(500).json({ status: false, message: 'Failed to unlike bar' });
    }
});

router.get('/tags/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const tag = await BarType.findById(id);
        if (!tag) {
            return res.status(404).json({ status: false, message: 'Tag not found' });
        }
        res.status(200).json({ status: true, data: tag });
    } catch (error) {
        console.error('Error fetching tag by ID:', error);
        res.status(500).json({ status: false, message: 'Failed to fetch tag' });
    }
});




  

export { router as BarRouter };
