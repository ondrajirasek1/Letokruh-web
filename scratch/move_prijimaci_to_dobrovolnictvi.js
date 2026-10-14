const fs = require('fs');
const path = require('path');

const dobrovolnictviPath = 'c:/Users/ondra/Documents/WBA/letokruh-web/stranky/dobrovolnictvi.html';
let content = fs.readFileSync(dobrovolnictviPath, 'utf8');

// Target block in dobrovolnictvi.html:
// Starts with: <!-- Organizations Section (Styled like Projekty v O nás) -->
// Ends with: </section> just before <!-- Modal for Testimonials -->

const startMarker = '<!-- Organizations Section (Styled like Projekty v O nás) -->';
const endMarker = '<!-- Modal for Testimonials -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found!');
    process.exit(1);
}

const replacementContent = `<!-- 5. SEKCE: Přijímací organizace -->
    <section class="org_intro_section" id="prijimaci-organizace" style="background-color: #ffffff; padding: 70px 50px 30px 50px;">
        <div class="org_intro_wrapper"
            style="max-width: 1000px; margin: 0 auto; display: flex; gap: 40px; align-items: center; justify-content: space-between;">
            <div style="flex: 1;">
                <h2 style="color: #43382d; font-size: 3rem; line-height: 1.2; margin: 0; font-family: 'Dederon-Sans', 'Dederon Sans', 'Roboto', sans-serif; font-weight: 700;">Přijímací<br>organizace</h2>
            </div>
            <div style="flex: 1;">
                <p style="color: #43382d; font-size: 1.1rem; line-height: 1.6; margin: 0;">
                    Partnery pro Letokruh a dobrovolníky jsou přijímající organizace, nejčastěji ze sociální oblasti.
                    Spolu s nimi hledáme vhodné možnosti a příležitosti pro zapojení proškolených a motivovaných
                    dobrovolníků.
                </p>
            </div>
        </div>
    </section>

    <!-- Grid Section (Styled like Projekty v O nás) -->
    <section class="projects_section" style="background-color: #ffffff; padding: 40px 50px 80px 50px;">
        <div class="projects_wrapper" style="max-width: 1100px; margin: 0 auto;">
            <h2 style="color: #43382d; font-size: 2.8rem; margin-bottom: 50px; text-align: center; font-family: 'Dederon-Sans', 'Dederon Sans', 'Roboto', sans-serif; font-weight: 700;">S kým pracujeme</h2>

            <div class="projects_clean_list">
                <!-- Item 1 -->
                <div class="project_list_item org_card" style="cursor: pointer;"
                    data-quote="Pro děti je to zážitek. Přijde babička - a ta naše je opravdová, skoro jako z pohádky. Posadí se do křesla, přivítá se s dětmi, povídají si a pak čte. Doma to tak mnohdy není, tak mě těší, že to mohou zažít u nás."
                    data-author="Věra Bokrová, ředitelka" data-org="MŠ Křejpského">
                    <span class="project_list_title">MŠ Křejpského <i class="fa-solid fa-chevron-right" style="font-size: 0.8em; margin-left: 6px; color: #cb2f1d;"></i></span>
                    <span class="project_list_subtitle">MŠ Křejpského (řekli o nás)</span>
                </div>
                <!-- Item 2 -->
                <div class="project_list_item org_card" style="cursor: pointer;"
                    data-quote="Dobrovolníci z Letokruhu pomáhají našim seniorům nejvíc samotným uvědoměním, že na všechno nejsou sami a že úplně pro každého je tu pomoc, pokud si o ni řekne."
                    data-author="Tereza Kazan, sociální pracovnice" data-org="DPS Braník">
                    <span class="project_list_title">DPS Braník <i class="fa-solid fa-chevron-right" style="font-size: 0.8em; margin-left: 6px; color: #cb2f1d;"></i></span>
                    <span class="project_list_subtitle">DPS Braník (řekli o nás)</span>
                </div>
                <!-- Item 3 -->
                <div class="project_list_item org_card" style="cursor: pointer;"
                    data-quote="Paní Irenka je moc laskavá a hodná čtecí babička. Děti ji mají rády a těší se na každé úterý, kdy babička přijde. Bedlivě poslouchají její pohádky a babička Irenka si pro ně vždy na začátku připraví svoje oblíbené dětské říkanky nebo básničky. Moc rádi s Irenkou spolupracujeme. Ve školce se zastaví i někdy nad rámec domluveného dne. Chodí se dívat na naše společná setkání s dětmi a rodiči a vždy ráda donese něco dobrého a vlastnoručně pečeného. Je pro nás velkým přínosem."
                    data-author="Jaroslav Třeštík, vedoucí dětské skupiny" data-org="MŠ Čtyři Medvědi, Praha 4">
                    <span class="project_list_title">MŠ Čtyři Medvědi, Praha 4 <i class="fa-solid fa-chevron-right" style="font-size: 0.8em; margin-left: 6px; color: #cb2f1d;"></i></span>
                    <span class="project_list_subtitle">MŠ Čtyři Medvědi (řekli o nás)</span>
                </div>
                <!-- Item 4 -->
                <div class="project_list_item org_card" style="cursor: pointer;"
                    data-quote="O vytváření komunit s návazností na pobočku dlouhodobě usilujeme. Dobrovolnice Letokruhu, paní Zdenka P., u nás v knihovně vede kurz trénování paměti. Velmi přispěla oživení tohoto prostoru i místní komunity, vytvořila v pobočce MKP Dům čtení v rámci kurzu přátelskou skupinu. Díky tomu frekventanti zvládli i omezení pobytových služeb a nějakou dobu pracovali online, pomáhali si navzájem. Dotazy na znovuotevření kurzu jsem dostávala v průběhu celého minulého roku. Toto jednoznačně vyplynulo z osobnosti paní P., je dobrovolnice s nejvyššími kvalitami. Erudovaná, kultivovaná, se zapálením pro věc, se schopností informace předat. Velice ráda s ní spolupracuji, již plánujeme podzimní výuku."
                    data-author="Martina Voříšková, ředitelka" data-org="Městská knihovna Praha (Dům čtení)">
                    <span class="project_list_title">Městská knihovna Praha (Dům čtení) <i class="fa-solid fa-chevron-right" style="font-size: 0.8em; margin-left: 6px; color: #cb2f1d;"></i></span>
                    <span class="project_list_subtitle">MKP Dům čtení, Praha 10 (řekli o nás)</span>
                </div>
                <!-- Item 5 -->
                <div class="project_list_item org_card" style="cursor: pointer;"
                    data-quote="Letokruh naprosto zapadá do naší filozofie. Jsme vděčni za příležitost k dobrovolnictví, jehož můžeme být součástí, a rádi pomůžeme šířit dobrou myšlenku. Z projektu Čtení u Jiráska máme velkou radost. Máme dvě senzační pohádkové babičky, Mirku a Jarku, které k nám chodí každý týden číst dětem pohádky. Je to hodinka plná naděje. Babičky mají radost z dětí, děti z babiček, maminky z klidné chvilky na kávu... A všichni si odnášíme satisfakci z podpory mezigeneračního setkávání, příležitosti podporovat lásku ke čtení u dětí a hlavně skvělý relax v podobě poslechu pohádky od babičky. Prodáváme taky dobrosušenky a skvělé buchty a koláče od babičky Brigity."
                    data-author="Lucie Jirásková, majitelka" data-org="Café Jirásek">
                    <span class="project_list_title">Café Jirásek <i class="fa-solid fa-chevron-right" style="font-size: 0.8em; margin-left: 6px; color: #cb2f1d;"></i></span>
                    <span class="project_list_subtitle">Café Jirásek (řekli o nás)</span>
                </div>
                <!-- Item 6 -->
                <div class="project_list_item org_card" style="cursor: pointer;"
                    data-quote="Dobrovolníci a Letokruh = aktivní přístup a obětavá sousedská pomoc, která přijde v pravý čas, a to nejen v čase, kdy je to nejvíc potřeba. Smysluplná setkávání, telefonické kontakty, fyzická pomoc a lidský přístup jsou v této náročné době projevem vzájemné pospolitosti, sounáležitosti a naděje. Dobrovolníci jsou pro nás jako organizaci a pro seniory společníky nejen v časech lepších, ale i pomocníky v časech složitějších."
                    data-author="Linda Obrtelová, ředitelka ÚSS Prahy 4" data-org="Ústav sociálních služeb v Praze 4">
                    <span class="project_list_title">Ústav sociálních služeb v Praze 4 <i class="fa-solid fa-chevron-right" style="font-size: 0.8em; margin-left: 6px; color: #cb2f1d;"></i></span>
                    <span class="project_list_subtitle">ÚSS Praha 4 (řekli o nás)</span>
                </div>
            </div>

            <div style="text-align: center; margin-top: 50px; color: #43382d;">
                a další organizace...
            </div>
        </div>
    </section>

    <!-- Education Section -->
    <section class="education_section">
        <div class="education_wrapper">
            <h2>Vzděláváme pracovníky přijímajících organizací</h2>
            <div class="education_box">
                <div class="education_item">
                    <div class="education_item_content">
                        <div class="education_item_title">Supervize koordinátorů dobrovolníků</div>
                        <p class="education_item_text">Nenechte si ujít pravidelná supervizní setkání pro pracovníky, kteří pracují s dobrovolníky</p>
                    </div>
                    <a href="#" class="education_item_link">Termíny a více informací <i class="fa-solid fa-angle-right"></i></a>
                </div>
                <div class="education_item">
                    <div class="education_item_content">
                        <div class="education_item_title">Dobrovolnictví v sociálních službách<br>pro seniory</div>
                        <p class="education_item_text">Akreditovaný prezenční kurz v rozsahu 8 hodin</p>
                    </div>
                    <a href="#" class="education_item_link">Termíny a více informací <i class="fa-solid fa-angle-right"></i></a>
                </div>
            </div>
        </div>
    </section>

    <!-- Workshop Section -->
    <section class="workshop_section">
        <div class="workshop_wrapper">
            <div class="workshop_intro">
                <p>Během úvodního workshopu organizace učíme, jak dobrovolníka zapojit<br>do činnosti, jak s ním pracovat dobře a efektivně, jak ho podporovat.<br>Podělíme se o praktické zkušenosti.</p>
            </div>
            
            <div class="workshop_content">
                <div class="workshop_text_col">
                    <h2>Staňte se přijímající organizací</h2>
                    <p>Rádi uspořádáme workshop ve vaší organizaci nebo pro určitou skupinu odborné i laické veřejnosti.</p>
                    <a href="#contact" class="button_workshop">Kontaktujte nás</a>
                </div>
                <div class="workshop_image_col">
                    <img src="../images/ostatni/organizace.png" alt="Staňte se přijímající organizací" class="workshop_image_placeholder" style="object-fit: cover; display: block;">
                </div>
            </div>
        </div>
    </section>

    `;

const newContent = content.substring(0, startIndex) + replacementContent + content.substring(endIndex);
fs.writeFileSync(dobrovolnictviPath, newContent, 'utf8');
console.log('Successfully replaced section in dobrovolnictvi.html');
