const fs = require('fs');
const path = require('path');

function checkFile(name) {
    const p = path.join('images', 'ostatni', name);
    if (fs.existsSync(p)) {
        console.log(`File: ${name} | Size: ${fs.statSync(p).size} bytes`);
    } else {
        console.log(`File: ${name} does not exist`);
    }
}

async function run() {
    console.log('Checking files:');
    checkFile('candidate_novy_spolecnik.jpg');
    checkFile('candidate_spolecnik_seiora.jpg');
    checkFile('candidate_den_dobrovolnictvi.jpg');
    checkFile('candidate_dny_dobrovolnictvi.jpg');
}

run();
