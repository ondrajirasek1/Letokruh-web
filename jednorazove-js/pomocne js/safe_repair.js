const fs = require('fs');

const imageMoves = {
    // Grafika
    "heart_line_yellow.png": "grafika",
    "heart_red.png": "grafika",
    "hero_mask.png": "grafika",
    "kruh_s_vyseci_oranzovy.png": "grafika",
    "kruh_s_vyseci_zluty.png": "grafika",
    "sisoid_cara_zeleny.png": "grafika",
    "sisoid_cary_oranzovy.png": "grafika",
    "sisoid_green.png": "grafika",
    "sisoid_line_yellow.png": "grafika",
    "srdce_cara_cervene.png": "grafika",
    "srdce_cara_oranzove.png": "grafika",
    "srdce_cara_zelene.png": "grafika",

    // Logos
    "Active-citizens-fund.png": "logos",
    "Co-Funded-By-the-EU-transparent-background.png": "logos",
    "JMS-logo-varianta1.png": "logos",
    "Letokruh_logo_horizontal.png": "logos",
    "SEEU-logo.2.png": "logos",
    "dreamlike-neighbourhood.png": "logos",
    "erasmus_en.png": "logos",
    "logo-uss4.png": "logos",
    "logo.svg": "logos",
    "partners_projekty.png": "logos",
    "passerinvest-logo-modra-na-bile-pozadi-rgb.png": "logos",
    "seniori_seniorum.png": "logos",

    // Partners
    "nadace_ep_group_logo_rgb.png": "partners",
    "nadacni_fond_ceskeho_rozhlasu.png": "partners",
    "infinit_sen_senohraby.png": "partners",
    "mhmp_logo_1.png": "partners",
    "praha_10_nove_3.png": "partners",
    "bohaya_mensi.png": "partners",
    "sonnentor.png": "partners",
    "tpa_logo.png": "partners",
    "zrno_zrnko.png": "partners",
    "jeziskova_vnoucata.png": "partners",
    "essencemediacom.png": "partners"
};

const replacements = [
    { from: /\uFFFD:/g, to: 'ě' },
    { from: /\uFFFD"/g, to: 'ř' },
    { from: /\uFFFDa/g, to: 'Ú' },
    { from: /\uFFFDR/g, to: 'Č' },
    { from: /\uFFFD}/g, to: 'Ď' },
    { from: /\uFFFD!/g, to: 'Ň' },
    // Ambiguous - replace with most common 'č'
    { from: /\uFFFD\uFFFD/g, to: 'č' },
];

function updateFile(filepath, doRepair = true) {
    try {
        let content = fs.readFileSync(filepath, 'utf8');
        let original = content;

        // 1. Repair Encoding
        if (doRepair) {
            replacements.forEach(rep => {
                content = content.replace(rep.from, rep.to);
            });

            // Heuristic fixes for ambiguity 'č' collisions
            content = content.replace(/Studčiččá/g, 'Studničná');
            content = content.replace(/hodče/g, 'hodně');
            content = content.replace(/buč/g, 'buď');
            content = content.replace(/teč/g, 'teď');
            content = content.replace(/čeditel/g, 'ředitel'); // Start of word Ř -> č corrected
            content = content.replace(/čekl/g, 'řekl'); // Řekl
            content = content.replace(/teč/g, 'teď');
        }

        // 2. Update Image Paths
        for (const [img, folder] of Object.entries(imageMoves)) {
            // Pattern: "images/filename"
            // Make sure we don't double replace if we run multiple times (check if already has folder)
            // But here we are strict: replace "images/filename" with "images/folder/filename"
            // Using split/join or replaceAll
            content = content.split(`images/${img}`).join(`images/${folder}/${img}`);
        }

        if (content !== original) {
            console.log(`Updating ${filepath}`);
            fs.writeFileSync(filepath, content, 'utf8');
        }
    } catch (e) {
        console.error(`Error ${filepath}:`, e);
    }
}

// Process files
// onas.html needs image fix but NO encoding fix (freshly restored)
updateFile('onas.html', false);

// others need both
const docs = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'onas.html' || f.endsWith('.css'));
docs.forEach(f => updateFile(f, true));
