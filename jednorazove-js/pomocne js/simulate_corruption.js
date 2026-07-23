const fs = require('fs');

// Czech characters to test
const chars = {
    'č': Buffer.from('č', 'utf8'), // C4 8D
    'ď': Buffer.from('ď', 'utf8'), // C4 8F
    'ě': Buffer.from('ě', 'utf8'), // C4 9B
    'ň': Buffer.from('ň', 'utf8'), // C5 88
    'ř': Buffer.from('ř', 'utf8'), // C5 99
    'š': Buffer.from('š', 'utf8'), // C5 A1
    'ť': Buffer.from('ť', 'utf8'), // C5 A5
    'ž': Buffer.from('ž', 'utf8'), // C5 BE
    'ů': Buffer.from('ů', 'utf8'), // C5 AF
    'Č': Buffer.from('Č', 'utf8'), // C4 8C
    'Ď': Buffer.from('Ď', 'utf8'), // C4 8E
    'Ň': Buffer.from('Ň', 'utf8'), // C5 87
    'Ř': Buffer.from('Ř', 'utf8'), // C5 98
    'Š': Buffer.from('Š', 'utf8'), // C5 A0
    'Ť': Buffer.from('Ť', 'utf8'), // C5 A4
    'Ž': Buffer.from('Ž', 'utf8'), // C5 BD
    'Ů': Buffer.from('Ů', 'utf8'), // C5 AE
    'Ú': Buffer.from('Ú', 'utf8'), // C3 9A
};

// Windows-1252 decoding table (approximate for the 80-9F range)
// We need to simulate what readFileSync('utf8') produced when reading the Double Encoded bytes.
// Double Encoded means: The bytes C4 8D were on disk. 
// "Corruption 1" (PowerShell): Read C4 8D as Win1252 (Ä and undefined?).
// Wait, PowerShell fix_images.ps1 did: Get-Content (ANSI/1252) -> string -> Set-Content (UTF8).
// So C4 8D -> "Ä" + "" (if 8D is undefined).
// Saved as UTF8: C3 84 (Ä) + EF BF BD ().
// "Corruption 2" (My Node Script): Read "Ä" (utf8).
// Buffer.from("Ä", 'binary'). 
// "Ä" (C3 84) -> C3 (first byte of Ä?). No.
// Buffer.from line logic: "Convert the "corrupted" UTF-8 string back to binary (latin1)"
// It takes codepoints. 
// "Ä" is U+00C4. < 256. So it becomes byte C4.
// "" is U+FFFD. > 255. Buffer.from('...', 'binary') truncates.
// FFFD -> FD.
// So buffer becomes C4 FD.
// toString('utf8') -> C4 FD -> "Äý". (C4 is start byte, FD is... ? C4 expects 80-BF. FD is invalid continuation).
// Actually C4 FD is invalid utf8. toString('utf8') might convert C4 to  and FD to . or single .

// Let's verify this hypothesis.
// We will assume the INITIAL state on disk before fix_encoding.js was "Double Encoded via 1252".

console.log("Char | UTF8 Hex | 1252 Interpreted | Saved UTF8 | Node Fixed Output");

for (const [char, buffer] of Object.entries(chars)) {
    // 1. Original Bytes
    const b1 = buffer[0];
    const b2 = buffer[1];

    // 2. PowerShell Interpretation (Win1252 -> Unicode)
    // We map byte b to Unicode char using Win1252 mapping.
    const c1 = map1252(b1);
    const c2 = map1252(b2);

    // 3. Saved as UTF8 (String "c1c2")
    const corruptedString = c1 + c2;

    // 4. Node fix_encoding.js logic
    const fixBuffer = Buffer.from(corruptedString, 'binary');
    const result = fixBuffer.toString('utf8');

    console.log(`${char} | ${buffer.toString('hex')} | ${hex(c1.charCodeAt(0))} ${hex(c2.charCodeAt(0))} | -> | ${escape(result)}`);
}

function hex(n) {
    return n.toString(16).toUpperCase().padStart(2, '0');
}

function escape(s) {
    return JSON.stringify(s).slice(1, -1);
}

function map1252(byte) {
    // Standard Latin1
    if (byte < 0x80 || (byte >= 0xA0 && byte <= 0xFF)) return String.fromCharCode(byte);

    // 1252 Extensions (80-9F)
    const map = {
        0x80: '\u20AC', 0x82: '\u201A', 0x83: '\u0192', 0x84: '\u201E', 0x85: '\u2026',
        0x86: '\u2020', 0x87: '\u2021', 0x88: '\u02C6', 0x89: '\u2030', 0x8A: '\u0160',
        0x8B: '\u2039', 0x8C: '\u0152', 0x8E: '\u017D',
        0x91: '\u2018', 0x92: '\u2019', 0x93: '\u201C', 0x94: '\u201D', 0x95: '\u2022',
        0x96: '\u2013', 0x97: '\u2014', 0x98: '\u02DC', 0x99: '\u2122', 0x9A: '\u0161',
        0x9B: '\u203A', 0x9C: '\u0153', 0x9E: '\u017E', 0x9F: '\u0178'
    };
    // Undefined in 1252? PowerShell might use replacement char or skip.
    // 81, 8D, 8F, 90, 9D
    return map[byte] || '\uFFFD';
}
