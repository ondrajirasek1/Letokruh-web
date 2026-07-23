const https = require('https');
const fs = require('fs');

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
    // dateStr format: "19. 05. 2026"
    const parts = dateStr.replace(/\s+/g, '').split('.');
    if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(0);
}

function getTagColor(tag) {
    return '#cb2f1d'; // default red
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

    const currentEvents = [];
    const archiveEvents = [];

    // Sort events by date descending for archive, ascending for current
    events.forEach(event => {
        const acf = event.acf || {};
        const eventDate = parseDate(acf.datum);
        const eventObj = {
            title: event.title.rendered,
            dateStr: acf.datum || '',
            timeStr: `${acf.zacatek_udalosti || ''} - ${acf.konec_udalosti || ''}`.replace(/ - $/, ''),
            tag: acf.typ_akce || 'Akce',
            location: getLocationAttr(acf.filtr_lokalita),
            timestamp: eventDate.getTime()
        };

        if (eventDate.getTime() >= today.getTime()) {
            currentEvents.push(eventObj);
        } else {
            archiveEvents.push(eventObj);
        }
    });

    currentEvents.sort((a, b) => a.timestamp - b.timestamp);
    archiveEvents.sort((a, b) => b.timestamp - a.timestamp); // descending for archive

    function generateHtml(eventList, hasLink) {
        return eventList.map(e => `                <div class="event_list_item" data-location="${e.location}">
                    <div class="event_list_date">
                        <span class="date_day">${e.dateStr}</span>
                        <span class="date_time">${e.timeStr}</span>
                    </div>
                    <div class="event_list_title">
                        <h3>${e.title}</h3>
                    </div>
                    <div class="event_list_actions">
                        <span class="event_tag">${e.tag}</span>${hasLink ? '\n                        <a href="#" class="event_more_link">Více informací <i class="fa-solid fa-angle-right"></i></a>' : ''}
                    </div>
                </div>`).join('\n');
    }

    const currentHtml = `<div class="events_list" id="current_events_grid">\n${generateHtml(currentEvents, true)}\n            </div>`;
    const archiveHtml = `<div class="events_list" id="archive_events_grid">\n${generateHtml(archiveEvents, false)}\n            </div>`;

    let programHtml = fs.readFileSync('program.html', 'utf8');
    
    // Replace current events
    programHtml = programHtml.replace(/<div class="events_list" id="current_events_grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, `${currentHtml}\n        </div>\n    </section>`);
    
    // Replace archive events
    programHtml = programHtml.replace(/<div class="events_list" id="archive_events_grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, `${archiveHtml}\n        </div>\n    </section>`);

    fs.writeFileSync('program.html', programHtml, 'utf8');
    console.log('Successfully updated program.html');
}

run();
