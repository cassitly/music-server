const express = require('express');
const { readdirSync, readFileSync, statSync } = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// API to fetch directory contents
app.get('/api/view/:dir', (req, res) => {
    try {
        const dirPath = path.join(__dirname, "../", req.params.dir);

        // Read the directory
        const items = readdirSync(dirPath);

        // Separate folders and files
        const folderContents = items.map(item => {
            const fullPath = path.join(dirPath, item);
            const isDirectory = statSync(fullPath).isDirectory();
            return {
                name: item,
                type: isDirectory ? 'folder' : 'file',
                path: fullPath
            };
        });

        // Respond with folder and file details
        const folders = folderContents.filter(item => item.type === 'folder');
        const files = folderContents.filter(item => item.type === 'file');

        res.json({
            folder: folders.map(folder => folder.name),
            files: files.map(file => ({
                name: file.name,
                content: readFileSync(file.path, 'utf-8') // Read file content
            }))
        });
    } catch (error) {
        console.error('Error reading directory:', error.message);
        res.status(500).json({ error: 'Failed to read directory' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
