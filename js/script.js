document.addEventListener('DOMContentLoaded', () => {
    const fontResizers = document.querySelectorAll('.font-resizer');

    // Check localStorage
    if (localStorage.getItem('fontsEnlarged') === 'true') {
        document.body.classList.add('fonts-enlarged');
        updateResizerText(true);
    }

    fontResizers.forEach(resizer => {
        resizer.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('fonts-enlarged');

            const isEnlarged = document.body.classList.contains('fonts-enlarged');
            localStorage.setItem('fontsEnlarged', isEnlarged);
            updateResizerText(isEnlarged);
        });
    });

    function updateResizerText(isEnlarged) {
        fontResizers.forEach(resizer => {
            // Keep the icon span
            const iconHtml = '<span class="icon-aa">AA</span> ';
            if (isEnlarged) {
                resizer.innerHTML = iconHtml + 'Zmenšit písmo';
            } else {
                resizer.innerHTML = iconHtml + 'Zvětšit písmo';
            }
        });
    }

    // Modal Logic
    const modal = document.getElementById('org_modal');
    const cards = document.querySelectorAll('.org_card');
    const closeBtn = document.querySelector('.close_modal');
    const modalQuote = document.getElementById('modal_quote_text');
    const modalAuthor = document.getElementById('modal_author_name');
    const modalOrg = document.getElementById('modal_org_name');

    if (modal && cards.length > 0) {
        // Open Modal
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const quoteText = card.getAttribute('data-quote');
                const authorText = card.getAttribute('data-author');
                const orgText = card.getAttribute('data-org');

                modalQuote.textContent = quoteText || "Text not available.";
                modalAuthor.textContent = authorText || "";
                modalOrg.textContent = orgText || "";

                modal.style.display = "flex";
            });
        });

        // Close Modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
        });

        // Close outside click
        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = "none";
            }
        });
    }


    // Newsletter Validation
    const newsletterForm = document.getElementById('newsletter_form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('newsletter_name');
            const emailInput = document.getElementById('newsletter_email');
            let isValid = true;

            // Clear previous errors
            document.querySelectorAll('.error_msg').forEach(el => el.remove());

            // Validate Name
            if (!nameInput.value.trim()) {
                showError(nameInput, "vyplňte prosím toto pole");
                isValid = false;
            }

            // Validate Email
            if (!emailInput.value.trim()) {
                showError(emailInput, "vyplňte prosím toto pole");
                isValid = false;
            }

            if (isValid) {
                // Here you would normally submit the form
                alert("Děkujeme za přihlášení!"); // Temporary feedback
                newsletterForm.reset();
            }
        });

        function showError(inputElement, message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error_msg';
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';

            // Insert after input but inside the form group
            // Ideally existing markup has .error_msg_container
            const container = inputElement.nextElementSibling;
            if (container && container.classList.contains('error_msg_container')) {
                container.appendChild(errorDiv);
            } else {
                inputElement.parentNode.appendChild(errorDiv);
            }
        }

        // Clear error on input
        ['newsletter_name', 'newsletter_email'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function () {
                    const container = this.nextElementSibling;
                    if (container && container.classList.contains('error_msg_container')) {
                        container.innerHTML = '';
                    }
                });
            }
        });
    }

    // Program Filtering Logic
    const eventCards = document.querySelectorAll('.event_list_item');
    const locationFilter = document.getElementById('event_location_filter');
    const monthFilter = document.getElementById('event_month_filter');
    const yearFilter = document.getElementById('event_year_filter');
    const clearDateBtn = document.getElementById('clear_date_filter');

    if (eventCards.length > 0) {
        let currentLocationFilter = locationFilter ? locationFilter.value : 'all';
        let currentMonthFilter = monthFilter ? monthFilter.value : '';
        let currentYearFilter = yearFilter ? yearFilter.value : '';

        let archiveVisibleCount = 5;
        const loadMoreBtn = document.getElementById('load_more_archive');

        const applyFilters = () => {
            let archiveMatchedCount = 0;

            eventCards.forEach(card => {
                const locationMatch = currentLocationFilter === 'all' || card.getAttribute('data-location') === currentLocationFilter;
                
                let dateMatch = true;
                if (currentMonthFilter || currentYearFilter) {
                    const dateElem = card.querySelector('.date_day');
                    if (dateElem) {
                        const dateText = dateElem.textContent.trim();
                        const parts = dateText.replace(/\s+/g, '').split('.');
                        if (parts.length >= 3) {
                            const m = parts[1].padStart(2, '0');
                            const y = parts[2];
                            if (currentMonthFilter && m !== currentMonthFilter) {
                                dateMatch = false;
                            }
                            if (currentYearFilter && y !== currentYearFilter) {
                                dateMatch = false;
                            }
                        }
                    }
                }

                const isArchive = card.closest('#archive_events_grid') !== null;
                const matches = locationMatch && dateMatch;

                if (matches) {
                    if (isArchive) {
                        if (archiveMatchedCount < archiveVisibleCount) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                        archiveMatchedCount++;
                    } else {
                        card.style.display = 'flex';
                    }
                } else {
                    card.style.display = 'none';
                }
            });

            if (loadMoreBtn) {
                if (archiveMatchedCount > archiveVisibleCount) {
                    loadMoreBtn.style.display = 'inline-block';
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            }
        };

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                archiveVisibleCount += 5;
                applyFilters();
            });
        }

        if (locationFilter) {
            locationFilter.addEventListener('change', () => {
                currentLocationFilter = locationFilter.value;
                if (currentLocationFilter !== 'all') {
                    locationFilter.classList.add('active');
                } else {
                    locationFilter.classList.remove('active');
                }
                archiveVisibleCount = 5;
                applyFilters();
            });
        }

        const handleDateChange = () => {
            currentMonthFilter = monthFilter ? monthFilter.value : '';
            currentYearFilter = yearFilter ? yearFilter.value : '';
            
            if (currentMonthFilter || currentYearFilter) {
                clearDateBtn.style.display = 'inline-block';
                if (currentMonthFilter) monthFilter.classList.add('active'); else monthFilter.classList.remove('active');
                if (currentYearFilter) yearFilter.classList.add('active'); else yearFilter.classList.remove('active');
            } else {
                clearDateBtn.style.display = 'none';
                if (monthFilter) monthFilter.classList.remove('active');
                if (yearFilter) yearFilter.classList.remove('active');
            }
            archiveVisibleCount = 5;
            applyFilters();
        };

        if (monthFilter) monthFilter.addEventListener('change', handleDateChange);
        if (yearFilter) yearFilter.addEventListener('change', handleDateChange);

        if (clearDateBtn) {
            clearDateBtn.addEventListener('click', () => {
                if (monthFilter) monthFilter.value = '';
                if (yearFilter) yearFilter.value = '';
                handleDateChange();
            });
        }
        
        // Initial apply to limit visible archive items
        applyFilters();

        // Event descriptions accordion toggle
        const moreLinks = document.querySelectorAll('.event_more_link');
        moreLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const card = link.closest('.event_list_item');
                if (!card) return;
                
                const desc = card.querySelector('.event_description');
                if (!desc) return;

                const isExpanded = desc.style.display === 'block';
                if (isExpanded) {
                    desc.style.display = 'none';
                    link.innerHTML = 'Více informací <i class="fa-solid fa-angle-down"></i>';
                } else {
                    desc.style.display = 'block';
                    link.innerHTML = 'Méně informací <i class="fa-solid fa-angle-up"></i>';
                }
            });
        });
    }

    // Aktuality detail view — replaces the grid when a card is clicked
    const aktualityGrid = document.getElementById('aktuality_grid');
    if (aktualityGrid) {
        const blogSection = aktualityGrid.closest('.blog_section') || aktualityGrid.parentElement;
        const loadMoreWrapper = blogSection.querySelector('.aktuality_load_more_wrapper');

        // Create a reusable detail view container (hidden by default)
        const detailView = document.createElement('div');
        detailView.className = 'aktuality_detail_view';
        detailView.style.display = 'none';
        // Insert it after the grid inside the same section
        aktualityGrid.after(detailView);

        const showDetail = (card) => {
            const desc = card.querySelector('.aktuality_card_description');
            const title = card.querySelector('.aktuality_card_title');
            const date = card.querySelector('.aktuality_card_date');
            const img = card.querySelector('.aktuality_card_image img');
            if (!desc) return;

            // Build the detail HTML
            detailView.innerHTML = `
                <a href="#" class="aktuality_back_link"><i class="fa-solid fa-arrow-left"></i> Zpět na aktuality</a>
                <div class="aktuality_detail_hero">
                    ${img ? `<img src="${img.src}" alt="${img.alt || ''}" class="aktuality_detail_hero_img">` : ''}
                    <div class="aktuality_detail_hero_text">
                        <h1 class="aktuality_detail_title">${title ? title.textContent : ''}</h1>
                        <span class="aktuality_detail_date">${date ? date.textContent : ''}</span>
                    </div>
                </div>
                <div class="aktuality_detail_body">
                    ${desc.innerHTML}
                </div>
            `;

            // Back button handler
            detailView.querySelector('.aktuality_back_link').addEventListener('click', (e) => {
                e.preventDefault();
                hideDetail();
            });

            // Hide grid + load more, show detail
            aktualityGrid.style.display = 'none';
            if (loadMoreWrapper) loadMoreWrapper.style.display = 'none';
            detailView.style.display = 'block';

            // Scroll to top of section
            blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        const hideDetail = () => {
            detailView.style.display = 'none';
            aktualityGrid.style.display = '';
            if (loadMoreWrapper) loadMoreWrapper.style.display = '';

            // Scroll back to top of section
            blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        // Delegate click on "Více informací" links
        aktualityGrid.addEventListener('click', (e) => {
            const moreLink = e.target.closest('.aktuality_more_link');
            if (!moreLink) return;

            e.preventDefault();
            const card = moreLink.closest('.aktuality_card');
            if (!card) return;

            showDetail(card);
        });
    }

    // Homepage news detail view
    const homepageNewsGrid = document.getElementById('homepage_news_grid');
    if (homepageNewsGrid) {
        const newsSection = homepageNewsGrid.closest('.news_section') || homepageNewsGrid.parentElement;

        // Create a reusable detail view container (hidden by default)
        const detailView = document.createElement('div');
        detailView.className = 'aktuality_detail_view';
        detailView.style.display = 'none';
        detailView.style.maxWidth = '1200px';
        detailView.style.margin = '0 auto';
        detailView.style.padding = '0 5%';
        // Insert it after the grid inside the same section
        homepageNewsGrid.after(detailView);

        const showDetail = (card) => {
            const desc = card.querySelector('.aktuality_card_description');
            const title = card.querySelector('.aktuality_card_title');
            const date = card.querySelector('.aktuality_card_date');
            const img = card.querySelector('.aktuality_card_image img');
            if (!desc) return;

            // Build the detail HTML
            detailView.innerHTML = `
                <a href="#" class="aktuality_back_link"><i class="fa-solid fa-arrow-left"></i> Zpět na aktuality</a>
                <div class="aktuality_detail_hero">
                    ${img ? `<img src="${img.src}" alt="${img.alt || ''}" class="aktuality_detail_hero_img">` : ''}
                    <div class="aktuality_detail_hero_text">
                        <h1 class="aktuality_detail_title">${title ? title.textContent : ''}</h1>
                        <span class="aktuality_detail_date">${date ? date.textContent : ''}</span>
                    </div>
                </div>
                <div class="aktuality_detail_body">
                    ${desc.innerHTML}
                </div>
            `;

            // Back button handler
            detailView.querySelector('.aktuality_back_link').addEventListener('click', (e) => {
                e.preventDefault();
                hideDetail();
            });

            // Hide grid, show detail
            homepageNewsGrid.style.display = 'none';
            detailView.style.display = 'block';

            // Scroll to top of section
            newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        const hideDetail = () => {
            detailView.style.display = 'none';
            homepageNewsGrid.style.display = '';

            // Scroll back to top of section
            newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        // Delegate click on "Více informací" links
        homepageNewsGrid.addEventListener('click', (e) => {
            const moreLink = e.target.closest('.aktuality_more_link');
            if (!moreLink) return;

            e.preventDefault();
            const card = moreLink.closest('.aktuality_card');
            if (!card) return;

            showDetail(card);
        });
    }

    // Sticky Support Banner ("Podpoř Letokruh" spodní lišta)
    const isClosedInSession = sessionStorage.getItem('letokruh_support_bar_closed');
    if (!isClosedInSession) {
        // Determine relative path to podpor-dobro.html and logo dynamically
        let supportUrl = 'stranky/podpor-dobro.html';
        let logoUrl = 'images/logos/Letokruh_logo_horizontal.png';
        const pathName = window.location.pathname;
        if (pathName.includes('/stranky/') || pathName.includes('/projekty/') || pathName.includes('/pribehy/') || pathName.includes('/blog/')) {
            supportUrl = '../stranky/podpor-dobro.html';
            logoUrl = '../images/logos/Letokruh_logo_horizontal.png';
        }

        const bar = document.createElement('div');
        bar.className = 'sticky_support_bar';
        bar.id = 'stickySupportBar';
        bar.innerHTML = `
            <div class="sticky_support_container">
                <div class="sticky_support_logo_wrapper">
                    <img src="${logoUrl}" alt="Letokruh Logo" class="sticky_support_logo_img">
                </div>
                <span class="sticky_support_title">
                    <strong class="sticky_support_title_main">PODPOŘ LETOKRUH!</strong> 
                    <span class="sticky_support_title_sub">Protože i stáří může rozdávat radost.</span>
                </span>
                <a href="${supportUrl}" class="sticky_support_donate" id="stickySupportDonateBtn">Podpořit</a>
            </div>
            <button type="button" class="sticky_support_close_btn" id="stickySupportCloseBtn" aria-label="Zavřít lištu">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        document.body.appendChild(bar);
        document.body.classList.add('has-sticky-support-bar');

        // Close button handler
        const closeBtn = bar.querySelector('#stickySupportCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                bar.classList.add('is-hidden');
                document.body.classList.remove('has-sticky-support-bar');
                sessionStorage.setItem('letokruh_support_bar_closed', 'true');
                setTimeout(() => {
                    bar.remove();
                }, 400);
            });
        }
    }
});

/* Poptávky Detail Toggle & Google Maps Distance Calculation */
function togglePoptavkaDetail(element) {
    const descCell = element.closest('.poptavka_desc_cell');
    const fullDesc = descCell.querySelector('.poptavka_desc_full');
    
    if (fullDesc.style.display === 'none' || !fullDesc.style.display) {
        fullDesc.style.display = 'block';
        element.innerHTML = 'skrýt detail <i class="fa-solid fa-angle-up"></i>';
    } else {
        fullDesc.style.display = 'none';
        element.innerHTML = '...více ZDE <i class="fa-solid fa-angle-down"></i>';
    }
}

function calculateDistance(destinationAddress) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${encodeURIComponent(destinationAddress)}&travelmode=transit`;
            window.open(mapsUrl, '_blank');
        }, function(error) {
            const startLocation = prompt("Zadejte vaši ulici nebo město pro výpočet trasy a vzdálenosti v km:", "");
            if (startLocation) {
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destinationAddress)}&travelmode=transit`;
                window.open(mapsUrl, '_blank');
            }
        });
    } else {
        const startLocation = prompt("Zadejte vaši ulici nebo město pro výpočet trasy a vzdálenosti v km:", "");
        if (startLocation) {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destinationAddress)}&travelmode=transit`;
            window.open(mapsUrl, '_blank');
        }
    }
}

/* ==========================================================================
   PROGRAM RESERVATION & SUBSTITUTE SYSTEM (Database Simulation)
   ========================================================================== */

let activeReservationCardTarget = null;
let simulatedSubstitutesDatabase = {};

function openReservationModal(title, datetime, buttonElem, isSubstitute = false) {
    activeReservationCardTarget = buttonElem ? buttonElem.closest('.event_list_item') : null;
    
    const modal = document.getElementById('reservation_modal_overlay');
    if (!modal) return;

    document.getElementById('modal_event_title').innerText = title;
    document.getElementById('modal_event_datetime').innerText = datetime;
    
    const stepForm = document.getElementById('modal_step_form');
    const stepSuccess = document.getElementById('modal_step_success');
    stepForm.style.display = 'block';
    stepSuccess.style.display = 'none';

    const statusBadge = document.getElementById('modal_capacity_status');
    const submitBtn = document.getElementById('btn_modal_submit');
    const isSubstituteInput = document.getElementById('modal_event_is_substitute');

    let curCount = 0;
    let maxCount = 12;
    if (activeReservationCardTarget) {
        curCount = parseInt(activeReservationCardTarget.getAttribute('data-capacity-current') || '8');
        maxCount = parseInt(activeReservationCardTarget.getAttribute('data-capacity-max') || '12');
    }

    if (isSubstitute || curCount >= maxCount) {
        isSubstituteInput.value = 'true';
        statusBadge.style.backgroundColor = '#fff3e0';
        statusBadge.style.color = '#e65100';
        statusBadge.innerHTML = `<i class="fa-solid fa-user-clock"></i> <strong>Kapacita akce je plně obsazena (${curCount}/${maxCount}).</strong> Registrujete se jako NÁHRADNÍK.`;
        submitBtn.innerHTML = 'Potvrdit registraci náhradníka';
    } else {
        isSubstituteInput.value = 'false';
        statusBadge.style.backgroundColor = '#ffece6';
        statusBadge.style.color = '#cb2f1d';
        const freeSpots = maxCount - curCount;
        statusBadge.innerHTML = `<i class="fa-solid fa-ticket"></i> Volná místa k okamžité rezervaci: <strong>${freeSpots} / ${maxCount}</strong>`;
        submitBtn.innerHTML = 'Potvrdit rezervaci';
    }

    modal.style.display = 'flex';
}

function closeReservationModal() {
    const modal = document.getElementById('reservation_modal_overlay');
    if (modal) modal.style.display = 'none';
}

function submitReservationForm(event) {
    event.preventDefault();
    const isSubstitute = document.getElementById('modal_event_is_substitute').value === 'true';
    const email = document.getElementById('res_email').value;

    if (activeReservationCardTarget) {
        let curCount = parseInt(activeReservationCardTarget.getAttribute('data-capacity-current') || '8');
        let maxCount = parseInt(activeReservationCardTarget.getAttribute('data-capacity-max') || '12');
        const eventId = activeReservationCardTarget.getAttribute('data-event-id') || 'event_default';

        if (!isSubstitute && curCount < maxCount) {
            curCount++;
            activeReservationCardTarget.setAttribute('data-capacity-current', curCount);
            
            const countElem = activeReservationCardTarget.querySelector('.count_current');
            if (countElem) countElem.innerText = curCount;

            const freeCountElem = activeReservationCardTarget.querySelector('.cap_free_count');
            if (freeCountElem) freeCountElem.innerText = maxCount - curCount;

            if (curCount >= maxCount) {
                const actionBtn = activeReservationCardTarget.querySelector('.btn_reservation_action');
                if (actionBtn) {
                    actionBtn.className = 'btn_substitute_action';
                    actionBtn.innerHTML = '<i class="fa-solid fa-user-clock"></i> Registrovat jako NÁHRADNÍK';
                    actionBtn.setAttribute('onclick', actionBtn.getAttribute('onclick').replace('false', 'true'));
                }
                const statusBadge = activeReservationCardTarget.querySelector('.capacity_badge_status');
                if (statusBadge) {
                    statusBadge.classList.add('full');
                    statusBadge.innerHTML = '<i class="fa-solid fa-user-xmark"></i> Obsazeno: <strong>12/12</strong> (Plno)';
                }
            }
        } else {
            if (!simulatedSubstitutesDatabase[eventId]) simulatedSubstitutesDatabase[eventId] = [];
            simulatedSubstitutesDatabase[eventId].push(email);
        }
    }

    const stepForm = document.getElementById('modal_step_form');
    const stepSuccess = document.getElementById('modal_step_success');
    const heading = document.getElementById('modal_success_heading');
    const text = document.getElementById('modal_success_text');

    if (isSubstitute) {
        heading.innerText = 'Registrace náhradníka byla úspěšná!';
        text.innerText = `Byly jste zařazeni do pořadníku náhradníků (${email}). Pokud se uvolní místo stornem rezervace, automaticky vám zašleme e-mail!`;
    } else {
        heading.innerText = 'Rezervace byla úspěšně vytvořena!';
        text.innerText = `Potvrzení rezervace bylo odesláno na váš e-mail (${email}). Děkujeme a těšíme se na vás!`;
    }

    stepForm.style.display = 'none';
    stepSuccess.style.display = 'block';
}

function cancelReservationDemo(eventId, cardElem) {
    if (!cardElem) return;
    let curCount = parseInt(cardElem.getAttribute('data-capacity-current') || '12');
    let maxCount = parseInt(cardElem.getAttribute('data-capacity-max') || '12');

    if (curCount > 0) {
        curCount--;
        cardElem.setAttribute('data-capacity-current', curCount);

        const countElem = cardElem.querySelector('.count_current');
        if (countElem) countElem.innerText = curCount;

        const freeCountElem = cardElem.querySelector('.cap_free_count');
        if (freeCountElem) freeCountElem.innerText = maxCount - curCount;

        const statusBadge = cardElem.querySelector('.capacity_badge_status');
        if (statusBadge) {
            statusBadge.classList.remove('full');
            statusBadge.innerHTML = `<i class="fa-solid fa-users"></i> Volná místa: <strong><span class="cap_free_count">${maxCount - curCount}</span>/${maxCount}</strong>`;
        }

        const actionBtn = cardElem.querySelector('.btn_substitute_action');
        if (actionBtn) {
            actionBtn.className = 'btn_reservation_action';
            actionBtn.innerHTML = '<i class="fa-solid fa-ticket"></i> Rezervovat místo';
        }

        const queue = simulatedSubstitutesDatabase[eventId] || [];
        const nextSubstituteEmail = queue.length > 0 ? queue.shift() : 'nahradnik1@letokruh.cz';

        const alertModal = document.getElementById('substitute_email_alert_modal');
        const alertEmailElem = document.getElementById('alert_substitute_email');
        if (alertModal && alertEmailElem) {
            alertEmailElem.innerText = nextSubstituteEmail;
            alertModal.style.display = 'flex';
        }
    }
}

function closeSubstituteAlert() {
    const alertModal = document.getElementById('substitute_email_alert_modal');
    if (alertModal) alertModal.style.display = 'none';
}

/* Program Advanced Filtering Listener */
document.addEventListener('DOMContentLoaded', () => {
    const topicFilter = document.getElementById('event_topic_filter');
    const timeFilter = document.getElementById('event_time_filter');
    const clearAllBtn = document.getElementById('clear_all_program_filters');
    const eventCards = document.querySelectorAll('.events_list .event_list_item');

    if (topicFilter || timeFilter) {
        const applyAdvancedFilters = () => {
            const topicVal = topicFilter ? topicFilter.value : 'all';
            const timeVal = timeFilter ? timeFilter.value : 'all';
            const locVal = document.getElementById('event_location_filter') ? document.getElementById('event_location_filter').value : 'all';
            const monthVal = document.getElementById('event_month_filter') ? document.getElementById('event_month_filter').value : '';
            const yearVal = document.getElementById('event_year_filter') ? document.getElementById('event_year_filter').value : '';

            let hasActiveFilter = (topicVal !== 'all' || timeVal !== 'all' || locVal !== 'all' || monthVal !== '' || yearVal !== '');
            if (clearAllBtn) clearAllBtn.style.display = hasActiveFilter ? 'inline-flex' : 'none';

            eventCards.forEach(card => {
                const cardTopic = card.getAttribute('data-topic') || 'vzdelavani';
                const cardTime = card.getAttribute('data-time') || 'dopoledne';
                const cardLoc = card.getAttribute('data-location') || 'borislavka';

                const topicMatch = (topicVal === 'all' || cardTopic === topicVal);
                const timeMatch = (timeVal === 'all' || cardTime === timeVal);
                const locMatch = (locVal === 'all' || cardLoc === locVal);

                let dateMatch = true;
                if (monthVal || yearVal) {
                    const dateElem = card.querySelector('.date_day');
                    if (dateElem) {
                        const parts = dateElem.textContent.trim().replace(/\s+/g, '').split('.');
                        if (parts.length >= 3) {
                            const m = parts[1].padStart(2, '0');
                            const y = parts[2];
                            if (monthVal && m !== monthVal) dateMatch = false;
                            if (yearVal && y !== yearVal) dateMatch = false;
                        }
                    }
                }

                if (topicMatch && timeMatch && locMatch && dateMatch) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        if (topicFilter) topicFilter.addEventListener('change', applyAdvancedFilters);
        if (timeFilter) timeFilter.addEventListener('change', applyAdvancedFilters);
        
        const locFilter = document.getElementById('event_location_filter');
        const mFilter = document.getElementById('event_month_filter');
        const yFilter = document.getElementById('event_year_filter');

        if (locFilter) locFilter.addEventListener('change', applyAdvancedFilters);
        if (mFilter) mFilter.addEventListener('change', applyAdvancedFilters);
        if (yFilter) yFilter.addEventListener('change', applyAdvancedFilters);

        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (topicFilter) topicFilter.value = 'all';
                if (timeFilter) timeFilter.value = 'all';
                if (locFilter) locFilter.value = 'all';
                if (mFilter) mFilter.value = '';
                if (yFilter) yFilter.value = '';
                applyAdvancedFilters();
            });
        }
    }

    // Auto-inject layout: topic tag beside title, 'Více informací' link below, and capacity top / button bottom on right column
    const currentEventCards = document.querySelectorAll('#current_events_grid .event_list_item');
    currentEventCards.forEach((card, index) => {
        const titleBox = card.querySelector('.event_list_title');
        const actionsBox = card.querySelector('.event_list_actions');

        if (titleBox && actionsBox && !actionsBox.querySelector('.btn_reservation_action') && !actionsBox.querySelector('.btn_substitute_action')) {
            const titleText = card.querySelector('h3') ? card.querySelector('h3').innerText : 'Akce Programu';
            const dateText = card.querySelector('.date_day') ? card.querySelector('.date_day').innerText : '';
            const timeText = card.querySelector('.date_time') ? card.querySelector('.date_time').innerText : '';
            const fullDateTime = `${dateText} | ${timeText}`;

            const eventId = `event_auto_${index}`;
            card.setAttribute('data-event-id', eventId);
            card.setAttribute('data-capacity-max', '12');
            card.setAttribute('data-capacity-current', '7');

            // Move tag inside titleBox beside title if tag exists
            const tagElem = actionsBox.querySelector('.event_tag');
            titleBox.style.cssText = 'flex: 1; display: flex; flex-direction: column; gap: 8px; padding: 0 20px;';
            
            const titleH3 = titleBox.querySelector('h3');
            if (titleH3) {
                const titleRow = document.createElement('div');
                titleRow.style.cssText = 'display: flex; align-items: center; gap: 12px; flex-wrap: wrap;';
                titleH3.parentNode.insertBefore(titleRow, titleH3);
                titleRow.appendChild(titleH3);
                titleH3.style.margin = '0';
                if (tagElem) titleRow.appendChild(tagElem);
            }

            // Move link below
            const linkElem = actionsBox.querySelector('.event_more_link');
            if (linkElem) {
                const linkDiv = document.createElement('div');
                linkDiv.appendChild(linkElem);
                titleBox.appendChild(linkDiv);
            }

            // Set actionsBox layout: Capacity on top, reservation button below
            actionsBox.style.cssText = 'display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 10px; min-width: 220px;';
            actionsBox.innerHTML = `
                <span class="capacity_badge_status">
                    <i class="fa-solid fa-users"></i> Volná místa: <strong><span class="cap_free_count">5</span>/12</strong>
                </span>
                <button type="button" class="btn_reservation_action" onclick="openReservationModal('${titleText.replace(/'/g, "\\'")}', '${fullDateTime}', this, false)">
                    <i class="fa-solid fa-ticket"></i> Rezervovat místo
                </button>
            `;
        }
    });

    // Auto-inject "Aktivita již proběhla" badge to all cards in #archive_events_grid
    const archiveCards = document.querySelectorAll('#archive_events_grid .event_list_item');
    archiveCards.forEach(card => {
        const titleBox = card.querySelector('.event_list_title');
        if (titleBox && !titleBox.querySelector('.archive_ended_badge')) {
            const badge = document.createElement('div');
            badge.className = 'archive_ended_badge';
            badge.innerHTML = '<i class="fa-solid fa-clock-rotate-left" style="color: #cb2f1d;"></i> Aktivita již proběhla';
            titleBox.appendChild(badge);
        }
    });
});


