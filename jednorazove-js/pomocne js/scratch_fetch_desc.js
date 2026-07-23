const fs = require('fs');
const https = require('https');

const targetCurrentEvents = [
    { date: "06. 05. 2026", time: "10:00 - 12:00", title: "Kurz kreativního psaní", tag: "Vzdělávání", location: "borislavka" },
    { date: "11. 05. 2026", time: "16:00 - 17:00", title: "Jóga na pohodu nejen pro seniory", tag: "Vzdělávání", location: "externi" },
    { date: "12. 05. 2026", time: "17:00 - 19:00", title: "Hudebně-literární odpoledne na Bořislavce", tag: "Vzdělávání", location: "borislavka" },
    { date: "13. 05. 2026", time: "09:00 - 11:00", title: "Anglická konverzace pro středně pokročilé", tag: "Vzdělávání", location: "borislavka" },
    { date: "13. 05. 2026", time: "15:00 - 16:00", title: "Zdravotní seminář", tag: "Vzdělávání", location: "michelska" },
    { date: "14. 05. 2026", time: "10:00 - 12:00", title: "S rozumem v hrsti", tag: "Vzdělávání", location: "michelska" },
    { date: "18. 05. 2026", time: "16:00 - 17:00", title: "Jóga na pohodu nejen pro seniory", tag: "Vzdělávání", location: "externi" },
    { date: "25. 05. 2026", time: "16:00 - 17:00", title: "Jóga nejen pro seniory", tag: "Vzdělávání", location: "externi" },
    { date: "27. 05. 2026", time: "09:00 - 11:00", title: "Anglická konverzace pro středně pokročilé", tag: "Vzdělávání", location: "borislavka" }
];

async function fetchAllEvents() {
    let allEvents = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const events = await new Promise((resolve, reject) => {
            https.get(`https://letokruh.eu/wp-json/wp/v2/udalosti?per_page=100&page=${page}`, (resp) => {
                let data = '';
                resp.on('data', (chunk) => { data += chunk; });
                resp.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.code && parsed.code === 'rest_post_invalid_page_number') {
                            resolve([]);
                        } else {
                            resolve(parsed);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', reject);
        });

        if (events.length > 0) {
            allEvents = allEvents.concat(events);
            page++;
        } else {
            hasMore = false;
        }
    }
    return allEvents;
}

function parseDate(dateStr) {
    if (!dateStr) return new Date(0);
    const parts = dateStr.replace(/\s+/g, '').split('.');
    if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(0);
}

function getLocationAttr(locArray) {
    if (!locArray || locArray.length === 0) return 'externi';
    const loc = locArray[0].toLowerCase();
    if (loc.includes('michelská')) return 'michelska';
    if (loc.includes('bořislavka') || loc.includes('borislavka')) return 'borislavka';
    return 'externi';
}

async function run() {
    const events = await fetchAllEvents();
    console.log(`Total events fetched: ${events.length}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const archiveEvents = [];
    const eventMap = {}; // mapping by title and date to easily find descriptions

    events.forEach(event => {
        const acf = event.acf || {};
        const eventDate = parseDate(acf.datum);
        const dateStr = acf.datum ? acf.datum.replace(/\s/g, '') : '';
        const title = event.title.rendered.trim();
        const desc = (event.content && event.content.rendered) ? event.content.rendered.trim() : '';
        
        eventMap[`${title}-${dateStr}`] = desc;

        const eventObj = {
            title: title,
            dateStr: acf.datum || '',
            timeStr: `${acf.zacatek_udalosti || ''} - ${acf.konec_udalosti || ''}`.replace(/ - $/, ''),
            tag: acf.typ_akce || 'Akce',
            location: getLocationAttr(acf.filtr_lokalita),
            timestamp: eventDate.getTime(),
            description: desc
        };

        if (eventDate.getTime() < today.getTime()) {
            archiveEvents.push(eventObj);
        }
    });

    archiveEvents.sort((a, b) => b.timestamp - a.timestamp); // descending for archive

    // Build current events with descriptions
    const currentEventsWithDesc = targetCurrentEvents.map(e => {
        const dStr = e.date.replace(/\s/g, '');
        const key = `${e.title}-${dStr}`;
        e.description = eventMap[key] || '<p>Informace nejsou k dispozici.</p>';
        return e;
    });

    function generateHtml(eventList, isArchive) {
        const textColor = isArchive ? '#88827c' : '#000000';
        const passedNotice = isArchive ? '<p style="color: #cb2f1d; font-weight: bold; margin-bottom: 15px;">Akce již proběhla.</p>' : '';
        
        return eventList.map(e => `                <div class="event_list_item" data-location="${e.location}">
                    <div class="event_list_date">
                        <span class="date_day">${e.dateStr || e.date}</span>
                        <span class="date_time">${e.timeStr || e.time}</span>
                    </div>
                    <div class="event_list_title">
                        <h3>${e.title}</h3>
                    </div>
                    <div class="event_list_actions">
                        <span class="event_tag">${e.tag}</span>
                        <a href="#" class="event_more_link">Více informací <i class="fa-solid fa-angle-down"></i></a>
                    </div>
                    <div class="event_description" style="display: none; width: 100%; margin-top: 20px; border-top: 1px solid #eaddd3; padding-top: 20px; color: ${textColor}; font-size: 1rem; line-height: 1.6;">
                        ${passedNotice}
                        ${e.description}
                    </div>
                </div>`).join('\n');
    }

    const currentHtml = `<div class="events_list" id="current_events_grid">\n${generateHtml(currentEventsWithDesc, false)}\n            </div>`;
    const archiveHtml = `<div class="events_list" id="archive_events_grid">\n${generateHtml(archiveEvents, true)}\n            </div>`;

    let programHtml = fs.readFileSync('program.html', 'utf8');
    
    // Replace current events
    programHtml = programHtml.replace(/<div class="events_list" id="current_events_grid">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/section>/, `${currentHtml}\n        </div>\n    </section>`);
    
    // Replace archive events
    programHtml = programHtml.replace(/<div class="events_list" id="archive_events_grid">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/section>/, `${archiveHtml}\n        </div>\n    </section>`);

    fs.writeFileSync('program.html', programHtml, 'utf8');
    console.log('Successfully updated program.html with descriptions');
}

run();
