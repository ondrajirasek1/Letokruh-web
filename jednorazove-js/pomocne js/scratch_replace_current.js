const fs = require('fs');

const events = [
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

const generateHtml = (eventList) => {
    return eventList.map(e => `                <div class="event_list_item" data-location="${e.location}">
                    <div class="event_list_date">
                        <span class="date_day">${e.date}</span>
                        <span class="date_time">${e.time}</span>
                    </div>
                    <div class="event_list_title">
                        <h3>${e.title}</h3>
                    </div>
                    <div class="event_list_actions">
                        <span class="event_tag">${e.tag}</span>
                        <a href="#" class="event_more_link">Více informací <i class="fa-solid fa-angle-right"></i></a>
                    </div>
                </div>`).join('\n');
};

const currentHtml = `<div class="events_list" id="current_events_grid">\n${generateHtml(events)}\n            </div>`;

let programHtml = fs.readFileSync('program.html', 'utf8');

// The script generates <div class="events_list" id="current_events_grid">...</div>
programHtml = programHtml.replace(/<div class="events_list" id="current_events_grid">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/section>/, `${currentHtml}\n        </div>\n    </section>`);

fs.writeFileSync('program.html', programHtml, 'utf8');
console.log('Replaced current events grid.');
