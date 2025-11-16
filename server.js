const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/animated', express.static(path.join(__dirname, 'animated')));

app.get('/api/icons', (req, res) => {
    const staticDir = path.join(__dirname, 'static');
    const animatedDir = path.join(__dirname, 'animated');

    const staticIcons = {};
    if (fs.existsSync(staticDir)) {
        fs.readdirSync(staticDir).forEach(category => {
            const catPath = path.join(staticDir, category);
            if (fs.statSync(catPath).isDirectory()) {
                staticIcons[category] = fs.readdirSync(catPath).filter(f => f.endsWith('.png'));
            }
        });
    }

    const animatedIcons = fs.existsSync(animatedDir)
        ? fs.readdirSync(animatedDir).filter(f => f.endsWith('.gif'))
        : [];

    res.json({ static: staticIcons, animated: animatedIcons });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
