document.addEventListener('DOMContentLoaded', () => {
    const translations = {};
    let currentLang = 'zh'; // Default language

    async function fetchTranslations() {
        try {
            const response = await fetch('data/translations.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            Object.assign(translations, data);
            setLanguage(currentLang); // Set initial language
        } catch (error) {
            console.error("Could not load translations:", error);
            document.body.innerHTML = "Error: Could not load website content.";
        }
    }

    function setLanguage(lang) {
        if (!translations[lang]) {
            console.error(`Language "${lang}" not found.`);
            return;
        }
        
        currentLang = lang;
        document.documentElement.lang = lang;

        // Set simple text content for elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Set placeholder content for elements with data-lang-placeholder attribute
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            const key = el.getAttribute('data-lang-placeholder');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Dynamically populate the services section
        populateServices(lang);
    }

    function populateServices(lang) {
        const container = document.getElementById('services-container');
        if (!container) {
            console.error('Services container not found.');
            return;
        }

        const servicePillars = [
            { key: 'dev', title_key: 'service_pillar_dev' },
            { key: 'infra', title_key: 'service_pillar_infra' },
            { key: 'security', title_key: 'service_pillar_security' },
            { key: 'comms', title_key: 'service_pillar_comms' },
            { key: 'support', title_key: 'service_pillar_support' }
        ];
        
        let fullContent = '';

        servicePillars.forEach(pillar => {
            const pillarTitle = translations[lang][pillar.title_key];
            const services = translations[lang][`${pillar.key}_services`] || [];
            
            if (services.length > 0) {
                fullContent += `
                    <div class="service-pillar mb-5">
                        <h3 class="service-pillar-heading">${pillarTitle}</h3>
                        <div class="row">
                `;

                services.forEach(service => {
                    fullContent += `
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="service-item h-100">
                                <h5 class="mb-2">${service.title}</h5>
                                <p class="text-muted mb-0">${service.desc}</p>
                            </div>
                        </div>
                    `;
                });

                fullContent += '</div></div>';
            }
        });

        container.innerHTML = fullContent;
    }

    // Add event listeners for language switcher
    document.getElementById('lang-zh').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentLang !== 'zh') setLanguage('zh');
    });

    document.getElementById('lang-en').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentLang !== 'en') setLanguage('en');
    });

    // Initial load
    fetchTranslations();
});
