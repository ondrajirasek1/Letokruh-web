const fs = require('fs');
let html = fs.readFileSync('program.html', 'utf8');

const targetStr = '</div>\n    </section>\n\n    <!-- CTA Section -->';
const btnHtml = `\n            <div style="text-align: center; margin-top: 40px;">
                <button id="load_more_archive" class="button_stories" style="border: none; cursor: pointer; font-family: inherit;">Načíst další</button>
            </div>\n        `;

if (html.includes('<button id="load_more_archive"')) {
    console.log("Button already exists");
} else {
    // Actually we can just find the end of the archive_events_grid.
    // The previous script replaced it like this:
    // programHtml = programHtml.replace(/<div class="events_list" id="archive_events_grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, \`\${archiveHtml}\n        </div>\n    </section>\`);
    
    // So the end of archive section is:
    //         </div> (ends events_list)
    //         </div> (ends events_wrapper)
    //     </section>
    
    // Let's replace:
    // </div>\n        </div>\n    </section> (the closing tags for events_list, events_wrapper, section)
    // Actually archiveHtml string doesn't have the closing div for events_list?
    // Wait, archiveHtml was:
    // const archiveHtml = `<div class="events_list" id="archive_events_grid">\n${generateHtml(archiveEvents, false)}\n            </div>`;
    // Then it was replaced: `${archiveHtml}\n        </div>\n    </section>`
    // So it looks like:
    //             </div>
    //         </div>
    //     </section>
    
    html = html.replace(/(<div class="events_list" id="archive_events_grid">[\s\S]*?<\/div>)\n\s*<\/div>\n\s*<\/section>/, `$1${btnHtml}</div>\n    </section>`);
    fs.writeFileSync('program.html', html, 'utf8');
    console.log("Added load more button");
}
