document.addEventListener('DOMContentLoaded', function () {

            const projectsData = [
                {
                    id: 'prj-healthcare',
                    title: 'AI 헬스케어 규제준수 플랫폼',
                    description: '디지털 헬스케어 기업이 복잡한 의료 데이터 규제(HIPAA, GDPR 등)를 손쉽게 준수하고 제품 개발에 집중하도록 돕는 Compliance-as-a-Service 솔루션입니다.',
                    status: 'Seed',
                    partners: 'OO대학병원, XX파트너스',
                    chartData: { labels: ['달성', '목표'], values: [60, 40] }
                },
                {
                    id: 'prj-legal',
                    title: 'AI 기반 법률 리스크 관리 SaaS',
                    description: '기업의 계약서, 법률문서 등을 AI로 분석하여 잠재적 법률 리스크를 사전에 식별하고 대응 방안을 제시하는 B2B SaaS입니다.',
                    status: 'Pre-Seed',
                    partners: '법무법인 OO',
                    chartData: { labels: ['달성', '목표'], values: [30, 70] }
                },
                {
                    id: 'prj-rag',
                    title: 'AI 정책 연구를 위한 RAG 툴체인',
                    description: '방대한 법률, 논문, 보고서 데이터를 학습한 RAG 기술을 활용하여 정책 연구자들이 신뢰할 수 있는 보고서를 신속하게 작성하도록 지원하는 전문 툴체인입니다.',
                    status: 'R&D',
                    partners: 'ETIV AI Institute 자체 개발',
                    chartData: { labels: ['달성', '목표'], values: [85, 15] }
                }
            ];

            const newsData = [
                { id: 'news-1', category: '언론보도', title: 'ETIV AI 연구소, AI 기반 헬스케어 규제 해결사로 나서', source: 'OO일보' },
                { id: 'news-2', category: '블로그', title: '[인사이트] 생성형 AI 시대, 법률 시장의 5가지 변화', source: 'ETIV Blog' },
                { id: 'news-3', category: '연구자료', title: 'AI 정책 수립을 위한 RAG 기술 활용 백서', source: 'ETIV Research' },
                { id: 'news-4', category: 'YouTube', title: '변새와 의새 Ep. 15 - AI 투자의 미래', source: 'YouTube Channel' },
                { id: 'news-5', category: '언론보도', title: 'ETIV, AI 스타트업 인큐베이팅 프로그램 공개', source: 'XX경제' },
                { id: 'news-6', category: '블로그', title: 'Human-Centric AI란 무엇인가?', source: 'ETIV Blog' },
            ];

            // --- Navigation and Basic UI ---
            const sections = document.querySelectorAll('.section');
            const navLinks = document.querySelectorAll('.nav-trigger');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            function showSection(id) {
                const targetId = id.startsWith('#') ? id.substring(1) : id;
                sections.forEach(section => {
                    section.classList.toggle('active', section.id === targetId);
                });
                updateActiveNav(targetId);
                window.scrollTo(0, 0);
            }

            function updateActiveNav(targetId) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${targetId}`);
                });
            }

            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    showSection(targetId);
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                });
            });

            mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

            const initialSection = window.location.hash || '#home';
            showSection(initialSection);

            // --- Gemini API Integration ---
            // WARNING: Do not expose API keys client-side.
            // This current implementation is for demonstration purposes only and exposes the API key.
            // In a production environment, you MUST use a backend proxy.
            //
            // How to implement a backend proxy:
            // 1. Create a backend endpoint (e.g., a serverless function or a small server).
            // 2. Securely store your API key in this backend environment.
            // 3. The backend endpoint will receive requests from the client, then make requests to the Gemini API using the stored API key.
            // 4. The backend then sends the Gemini API's response back to the client.
            // 5. Modify this `callGeminiAPI` function to fetch data from your new backend endpoint URL.
            //    Example: const backendApiUrl = "/api/gemini-proxy"; // Replace with your actual backend endpoint
            //             const response = await fetch(backendApiUrl, { method: 'POST', body: JSON.stringify({ prompt: prompt }) });
            const aiModal = document.getElementById('ai-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalContent = document.getElementById('modal-content');
            const modalCloseBtn = document.getElementById('modal-close-btn');

            if (modalCloseBtn) {
                modalCloseBtn.addEventListener('click', () => aiModal.classList.add('hidden'));
            }
            if (aiModal) {
                aiModal.addEventListener('click', (e) => {
                    if (e.target === aiModal) {
                        aiModal.classList.add('hidden');
                    }
                });
            }


            function showLoadingInModal(title) {
                if (modalTitle) modalTitle.textContent = title;
                if (modalContent) modalContent.innerHTML = `
                    <div class="flex justify-center items-center py-10">
                        <div class="spinner w-12 h-12 rounded-full border-4 border-slate-200"></div>
                        <p class="ml-4 text-slate-600">AI가 분석 중입니다. 잠시만 기다려주세요...</p>
                    </div>
                `;
                if (aiModal) aiModal.classList.remove('hidden');
            }

            async function callGeminiAPI(prompt) {
                const apiKey = ""; // TODO: Implement backend proxy and remove/replace this.
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) throw new Error(`API Error: ${response.status}`);

                    const result = await response.json();

                    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                        return result.candidates[0].content.parts[0].text;
                    } else {
                        throw new Error("Invalid API response structure.");
                    }
                } catch (error) {
                    console.error('Gemini API call failed:', error);
                    return "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
                }
            }

            function formatAIResponse(text) {
                if (!text) return "";
                return text
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>') // Bold
                    .replace(/\* (.*?)(?=\n\*|\n\n|$)/g, '<li class="ml-5 list-disc">$1</li>') // List items
                    .replace(/(<\/li>)+/g, '</li>') // Clean up multiple closing tags
                    .replace(/^(?!<li|<\/ul>)(.*?)(\n|$)/gm, '<p>$1</p>') // Wrap non-list lines in <p>
                    .replace(/<\/li><p>/g, '</li></ul><p>') // Close list before new paragraph
                    .replace(/<p><li/g, '<ul><li') // Start list
                    .replace(/(<\/li>)(?!<li)/g, '$1</ul>'); // End list at the end
            }


            // --- Projects Section Logic ---
            function renderProjects() {
                const grid = document.getElementById('projects-grid');
                if (!grid) return;
                grid.innerHTML = '';
                projectsData.forEach((project, index) => {
                    const card = document.createElement('div');
                    card.className = 'bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col';
                    card.innerHTML = `
                        <div>
                            <span class="text-sm font-semibold text-white bg-blue-700 py-1 px-3 rounded-full">${project.status}</span>
                            <h3 class="mt-4 text-xl font-bold text-slate-900">${project.title}</h3>
                            <p class="mt-2 text-base text-slate-600 flex-grow">${project.description}</p>
                        </div>
                        <div class="mt-6">
                            <div class="chart-container h-48 sm:h-56 mx-auto">
                                <canvas id="project-chart-${index}"></canvas>
                            </div>
                            <p class="mt-4 text-sm text-slate-500"><strong>참여기관:</strong> ${project.partners}</p>
                             <div class="flex flex-col sm:flex-row gap-2 mt-4">
                                <button class="w-full text-blue-800 font-semibold py-2 px-4 rounded-md border border-blue-200 hover:bg-blue-50">[PDF] 보고서</button>
                                <button id="analyze-btn-${project.id}" class="w-full bg-blue-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-900">✨ AI 사업 모델 분석</button>
                             </div>
                        </div>
                    `;
                    grid.appendChild(card);
                    createProjectChart(index, project.chartData);

                    const analyzeBtn = document.getElementById(`analyze-btn-${project.id}`);
                    if (analyzeBtn) {
                        analyzeBtn.addEventListener('click', async () => {
                            showLoadingInModal(`✨ ${project.title} 분석`);
                            const promptText = `다음 AI 사업 모델에 대한 SWOT 분석(강점, 약점, 기회, 위협)을 전문가 수준으로 작성해줘. 각 항목은 명확하게 구분하고, 구체적인 예시를 포함해줘.\n\n- 사업 모델: ${project.title}\n- 설명: ${project.description}`;
                            const result = await callGeminiAPI(promptText);
                            if (modalContent) modalContent.innerHTML = formatAIResponse(result);
                        });
                    }
                });
            }

            function createProjectChart(index, data) {
                 const canvas = document.getElementById(`project-chart-${index}`);
                 if (!canvas) return;
                 const ctx = canvas.getContext('2d');
                 new Chart(ctx, { type: 'doughnut', data: { labels: data.labels, datasets: [{ data: data.values, backgroundColor: ['#1d4ed8', '#dbeafe'], borderColor: '#ffffff', borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: true, callbacks: { label: (c) => `${c.label}: ${c.raw}%` } } } } });
            }
            renderProjects();

            // --- News Section Logic ---
            const newsGrid = document.getElementById('news-grid');
            const filterBtns = document.querySelectorAll('.news-filter-btn');

            function renderNews(filter = 'All') {
                if (!newsGrid) return;
                newsGrid.innerHTML = '';
                const filteredNews = filter === 'All' ? newsData : newsData.filter(item => item.category === filter);

                filteredNews.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'news-item bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 flex flex-col';
                    card.innerHTML = `
                        <div class="p-6 flex-grow">
                            <span class="text-xs font-semibold uppercase tracking-wider text-blue-700">${item.category}</span>
                            <h4 class="mt-2 font-bold text-lg text-slate-800">${item.title}</h4>
                            <p class="mt-3 text-sm text-slate-500">출처: ${item.source}</p>
                            <div id="summary-container-${item.id}" class="mt-4 text-sm bg-slate-50 p-3 rounded-md border border-slate-200 hidden"></div>
                        </div>
                        <div class="p-4 bg-slate-50 border-t">
                            <button id="summarize-btn-${item.id}" class="w-full text-center text-sm font-semibold text-blue-700 hover:text-blue-900">✨ AI 한 줄 요약 보기</button>
                        </div>
                    `;
                    newsGrid.appendChild(card);

                    const summarizeBtn = document.getElementById(`summarize-btn-${item.id}`);
                    const summaryContainer = document.getElementById(`summary-container-${item.id}`);

                    if (summarizeBtn && summaryContainer) {
                        summarizeBtn.addEventListener('click', async function() {
                            this.textContent = '요약 중...';
                            this.disabled = true;

                            const promptText = `다음 기사 제목과 출처를 바탕으로, 기사의 핵심 내용을 한 문장으로 요약해줘: \n\n- 제목: ${item.title}\n- 출처: ${item.source}`;
                            const summary = await callGeminiAPI(promptText);

                            summaryContainer.innerHTML = `<strong class="text-blue-800">AI 요약:</strong> ${summary}`;
                            summaryContainer.classList.remove('hidden');
                            if (this.parentElement) this.parentElement.classList.add('hidden'); // Hide the button's container
                        });
                    }
                });
            }

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active-filter'));
                    btn.classList.add('active-filter');
                    renderNews(btn.dataset.filter);
                });
            });

            const activeFilterStyle = document.createElement('style');
            activeFilterStyle.innerHTML = `.active-filter{background-color:#1e40af !important;color:white !important}.news-filter-btn{background-color:#e2e8f0;color:#334155;transition:background-color .2s,color .2s}.news-filter-btn:hover{background-color:#cbd5e1}`;
            document.head.appendChild(activeFilterStyle);

            renderNews();

            // --- Language Toggle Functionality ---
            const translations = {
                kr: {
                    sloganLine1: "AI for",
                    sloganLine2: "Public Good.",
                    sloganLine3: "AI for",
                    sloganLine4: "Fair Markets.",
                    homeCTAAbout: "연구소 더 알아보기",
                    navAbout: "About ETIV",
                    navWhatWeDo: "What We Do",
                    navProjects: "Our Projects",
                    navJoin: "Join ETIV",
                    navNews: "News & Resources",
                    navContact: "Contact",
                    mobileNavAbout: "About ETIV",
                    mobileNavWhatWeDo: "What We Do",
                    mobileNavProjects: "Our Projects",
                    mobileNavJoin: "Join ETIV",
                    mobileNavNews: "News & Resources",
                    mobileNavContact: "Contact"
                },
                en: {
                    sloganLine1: "AI for",
                    sloganLine2: "Public Good (EN)",
                    sloganLine3: "AI for",
                    sloganLine4: "Fair Markets (EN)",
                    homeCTAAbout: "Learn More About Us",
                    navAbout: "About ETIV (EN)",
                    navWhatWeDo: "What We Do (EN)",
                    navProjects: "Our Projects (EN)",
                    navJoin: "Join ETIV (EN)",
                    navNews: "News & Resources (EN)",
                    navContact: "Contact (EN)",
                    mobileNavAbout: "About ETIV (EN)",
                    mobileNavWhatWeDo: "What We Do (EN)",
                    mobileNavProjects: "Our Projects (EN)",
                    mobileNavJoin: "Join ETIV (EN)",
                    mobileNavNews: "News & Resources (EN)",
                    mobileNavContact: "Contact (EN)"
                }
            };

            const langKrBtn = document.getElementById('lang-kr');
            const langEnBtn = document.getElementById('lang-en');

            const navAboutEl = document.getElementById('nav-about');
            const navWhatWeDoEl = document.getElementById('nav-what-we-do');
            const navProjectsEl = document.getElementById('nav-projects');
            const navJoinEl = document.getElementById('nav-join');
            const navNewsEl = document.getElementById('nav-news');
            const navContactEl = document.getElementById('nav-contact');
            const mobileNavAboutEl = document.getElementById('mobile-nav-about');
            const mobileNavWhatWeDoEl = document.getElementById('mobile-nav-what-we-do');
            const mobileNavProjectsEl = document.getElementById('mobile-nav-projects');
            const mobileNavJoinEl = document.getElementById('mobile-nav-join');
            const mobileNavNewsEl = document.getElementById('mobile-nav-news');
            const mobileNavContactEl = document.getElementById('mobile-nav-contact');
            const sloganLine1El = document.getElementById('slogan-line1');
            const sloganLine2El = document.getElementById('slogan-line2');
            const sloganLine3El = document.getElementById('slogan-line3');
            const sloganLine4El = document.getElementById('slogan-line4');
            const homeCTAAboutEl = document.getElementById('home-cta-about');


            function setLanguage(lang) {
                const t = translations[lang];
                if (!t) return;

                if (sloganLine1El) sloganLine1El.textContent = t.sloganLine1;
                if (sloganLine2El) sloganLine2El.textContent = t.sloganLine2;
                if (sloganLine3El) sloganLine3El.textContent = t.sloganLine3;
                if (sloganLine4El) sloganLine4El.textContent = t.sloganLine4;
                if (homeCTAAboutEl) homeCTAAboutEl.textContent = t.homeCTAAbout;

                if (navAboutEl) navAboutEl.textContent = t.navAbout;
                if (navWhatWeDoEl) navWhatWeDoEl.textContent = t.navWhatWeDo;
                if (navProjectsEl) navProjectsEl.textContent = t.navProjects;
                if (navJoinEl) navJoinEl.textContent = t.navJoin;
                if (navNewsEl) navNewsEl.textContent = t.navNews;
                if (navContactEl) navContactEl.textContent = t.navContact;

                if (mobileNavAboutEl) mobileNavAboutEl.textContent = t.mobileNavAbout;
                if (mobileNavWhatWeDoEl) mobileNavWhatWeDoEl.textContent = t.mobileNavWhatWeDo;
                if (mobileNavProjectsEl) mobileNavProjectsEl.textContent = t.mobileNavProjects;
                if (mobileNavJoinEl) mobileNavJoinEl.textContent = t.mobileNavJoin;
                if (mobileNavNewsEl) mobileNavNewsEl.textContent = t.mobileNavNews;
                if (mobileNavContactEl) mobileNavContactEl.textContent = t.mobileNavContact;

                if (langKrBtn && langEnBtn) {
                    if (lang === 'kr') {
                        langKrBtn.classList.remove('text-slate-400', 'hover:text-slate-800');
                        langKrBtn.classList.add('text-slate-800', 'font-semibold');
                        langEnBtn.classList.remove('text-slate-800', 'font-semibold');
                        langEnBtn.classList.add('text-slate-400', 'hover:text-slate-800');
                    } else {
                        langEnBtn.classList.remove('text-slate-400', 'hover:text-slate-800');
                        langEnBtn.classList.add('text-slate-800', 'font-semibold');
                        langKrBtn.classList.remove('text-slate-800', 'font-semibold');
                        langKrBtn.classList.add('text-slate-400', 'hover:text-slate-800');
                    }
                }
            }
            if (langKrBtn) langKrBtn.addEventListener('click', () => setLanguage('kr'));
            if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));

            setLanguage('kr');

            // --- Form Handling ---
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    alert("문의해주셔서 감사합니다! 현재 이 양식은 데모용이며, 실제 데이터 전송은 구현되지 않았습니다. 빠른 시일 내에 기능을 추가하겠습니다.");
                });
            }

            const newsletterForm = document.getElementById('newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    alert("구독해주셔서 감사합니다! 현재 이 양식은 데모용이며, 실제 데이터 전송은 구현되지 않았습니다.");
                });
            }
        });
