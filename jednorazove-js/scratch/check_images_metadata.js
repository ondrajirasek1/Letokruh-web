const fs = require('fs');
const path = require('path');

const dir = 'images/ostatni';
fs.readdirSync(dir).forEach(file => {
    if (file.toLowerCase().includes('spolecnik') || file.toLowerCase().includes('organiz') || file.toLowerCase().includes('candidat') || file.toLowerCase().includes('volunt') || file.toLowerCase().includes('junior')) {
        console.log(`File: ${file} | Size: ${fs.statSync(path.join(dir, file)).size}`);
    }
});
