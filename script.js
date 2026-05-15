
        // Registrasi Plugin GSAP
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        // Mengatur default animasi global agar konsisten dan mewah
        gsap.defaults({ ease: "power4.out", duration: 1.2 });

        // --- MOBILE MENU LOGIC (COMPACT ICON BAR) ---
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link-item');
        let isMobileMenuOpen = false;

        function toggleMobileMenu() {
            isMobileMenuOpen = !isMobileMenuOpen;
            if (isMobileMenuOpen) {
                mobileMenu.classList.add('menu-active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenu.classList.remove('menu-active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars-staggered"></i>';
            }
        }

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Tutup menu dengan halus jika klik link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if(isMobileMenuOpen) toggleMobileMenu();
            });
        });

        // Tutup menu jika user scroll
        window.addEventListener('scroll', () => {
             if(isMobileMenuOpen) toggleMobileMenu();
        });

        // --- CINEMATIC THEME TOGGLE (VIEW TRANSITIONS API) ---
        const themeBtnDesktop = document.getElementById('theme-toggle');
        const themeIconDesktop = document.getElementById('theme-icon');
        const themeBtnMobile = document.getElementById('theme-toggle-mobile');
        const themeIconMobile = document.getElementById('theme-icon-mobile');
        const body = document.body;

        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-theme');
            themeIconDesktop.classList.replace('fa-moon', 'fa-sun');
            themeIconMobile.classList.replace('fa-moon', 'fa-sun');
        }

        function toggleThemeLogic() {
            body.classList.toggle('dark-theme');
            const isDark = body.classList.contains('dark-theme');
            
            // Rotasi ikon yang lebih dramatis
            themeIconDesktop.style.transform = isDark ? 'rotate(360deg) scale(1.1)' : 'rotate(-360deg) scale(1)';
            themeIconMobile.style.transform = isDark ? 'rotate(360deg) scale(1.1)' : 'rotate(-360deg) scale(1)';
            
            setTimeout(() => {
                themeIconDesktop.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
                themeIconMobile.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
            }, 150);
            
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        function handleThemeClick(e) {
            if (!document.startViewTransition) {
                toggleThemeLogic();
                return;
            }

            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

            const transition = document.startViewTransition(() => toggleThemeLogic());

            transition.ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${endRadius}px at ${x}px ${y}px)`
                        ]
                    },
                    {
                        duration: 1000,
                        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // Apple-like easing
                        pseudoElement: '::view-transition-new(root)'
                    }
                );
            });
        }

        themeBtnDesktop.addEventListener('click', handleThemeClick);
        themeBtnMobile.addEventListener('click', handleThemeClick);

        // --- PRICING TOGGLE LOGIC (WITH PREMIUM FADE-SCALE EFFECT) ---
        const btnFoto = document.getElementById('toggle-foto');
        const btnVideo = document.getElementById('toggle-video');
        const fotoContents = document.querySelectorAll('.pricing-content-foto');
        const videoContents = document.querySelectorAll('.pricing-content-video');

        function switchPricing(mode) {
            const activeBtn = mode === 'foto' ? btnFoto : btnVideo;
            const inactiveBtn = mode === 'foto' ? btnVideo : btnFoto;
            const activeContents = mode === 'foto' ? fotoContents : videoContents;
            const hiddenContents = mode === 'foto' ? videoContents : fotoContents;

            // Update button styles
            activeBtn.classList.add('bg-[var(--text-main)]', 'text-[var(--bg-main)]');
            activeBtn.classList.remove('text-[var(--text-muted)]');
            inactiveBtn.classList.remove('bg-[var(--text-main)]', 'text-[var(--bg-main)]');
            inactiveBtn.classList.add('text-[var(--text-muted)]');

            // Hide old content instantly, animate new content with a subtle premium scale
            hiddenContents.forEach(el => el.classList.add('hidden'));
            activeContents.forEach(el => {
                el.classList.remove('hidden');
                gsap.fromTo(el, 
                    { opacity: 0, y: 15, scale: 0.98 }, 
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
                );
            });
        }

        btnFoto.addEventListener('click', () => switchPricing('foto'));
        btnVideo.addEventListener('click', () => switchPricing('video'));


        // --- MODAL LOGIC (CATEGORY & GALLERY) ---
        const catModal = document.getElementById('category-modal');
        const catModalContent = document.getElementById('category-modal-content');
        
        const galleryModal = document.getElementById('gallery-modal');
        const modalContentGallery = document.getElementById('modal-content-gallery');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalGrid = document.getElementById('modal-grid');
        
        const fallbackImage = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"; 

        const portfolioData = {
            wedding: [
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800"
            ],
            prewedding: [
                "https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1621689269408-db28b9d3bf67?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9b?auto=format&fit=crop&q=80&w=800"
            ],
            graduation: [
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1568165039239-16a75f0f3531?auto=format&fit=crop&q=80&w=800"
            ],
            event: [
                "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800"
            ]
        };

        function slideCategory(direction) {
            const slider = document.getElementById('category-slider');
            const scrollAmount = window.innerWidth < 768 ? 160 : 300; 
            slider.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
        }

        function openCategoryModal() {
            catModal.classList.remove('hidden');
            setTimeout(() => {
                catModal.classList.remove('opacity-0');
                catModalContent.classList.remove('scale-95');
            }, 10);
            document.body.style.overflow = 'hidden';
        }

        function closeCategoryModal() {
            catModal.classList.add('opacity-0');
            catModalContent.classList.add('scale-95');
            setTimeout(() => {
                catModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }

        function openGalleryModal(title, desc, categoryKey) {
            if (!catModal.classList.contains('hidden')) {
                catModal.classList.add('opacity-0');
                setTimeout(() => { catModal.classList.add('hidden'); }, 300);
            }

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalGrid.innerHTML = '';

            const images = portfolioData[categoryKey] || [];
            images.forEach((imgSrc) => {
                const imgElement = document.createElement('div');
                imgElement.className = 'masonry-item rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-lg border border-[var(--border-color)] opacity-0 group relative bg-[var(--bg-card)] cursor-pointer';
                imgElement.innerHTML = `
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 z-10 pointer-events-none"></div>
                    <img src="${imgSrc}" 
                         onerror="this.onerror=null; this.src='${fallbackImage}';" 
                         class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                         alt="Portfolio Image">
                `;
                modalGrid.appendChild(imgElement);
            });

            galleryModal.classList.remove('hidden');
            
            // Animasi kemunculan galeri beruntun (Staggering) yang sangat estetik
            setTimeout(() => {
                galleryModal.classList.remove('opacity-0');
                modalContentGallery.classList.remove('scale-95');
                gsap.fromTo('.masonry-item', 
                    { y: 40, opacity: 0, scale: 0.95 }, 
                    { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: "expo.out", delay: 0.1 }
                );
            }, 10);
            document.body.style.overflow = 'hidden';
        }

        function backToCategoryModal() {
            galleryModal.classList.add('opacity-0');
            modalContentGallery.classList.add('scale-95');
            setTimeout(() => {
                galleryModal.classList.add('hidden');
                openCategoryModal(); 
            }, 300);
        }

        function closeGalleryModal() {
            galleryModal.classList.add('opacity-0');
            modalContentGallery.classList.add('scale-95');
            setTimeout(() => {
                galleryModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }

        catModal.addEventListener('click', (e) => {
            if(e.target === catModal) closeCategoryModal();
        });
        
        galleryModal.addEventListener('click', (e) => {
            if(e.target === galleryModal) closeGalleryModal();
        });

        // --- SCROLL ANIMATIONS (SNAPPY & ELEGANT) ---
        window.addEventListener('load', () => {
            
            // Perbaikan agar ukuran trigger dinamis tidak nyangkut saat resize layar
            window.addEventListener('resize', () => ScrollTrigger.refresh());

            // Nav Blur Logic
            window.addEventListener('scroll', () => {
                const nav = document.getElementById('main-nav');
                if (window.scrollY > 50) nav.classList.add('nav-blur');
                else nav.classList.remove('nav-blur');
            });

            // Hero Animation: Smooth float up
            gsap.from(".hero-content > *", { y: 50, opacity: 0, duration: 1.5, stagger: 0.15, ease: "expo.out" });

            // Portofolio Animations
            gsap.from("#portfolio .mask-bottom-fade .portfolio-grid-col", {
                scrollTrigger: { trigger: "#portfolio", start: "top 85%", toggleActions: "play none none reverse" },
                y: 80, opacity: 0, scale: 0.98, duration: 1.5, stagger: 0.15, ease: "expo.out"
            });
            gsap.from("#portfolio .portfolio-header > *", {
                scrollTrigger: { trigger: "#portfolio .portfolio-header", start: "top 90%", toggleActions: "play none none reverse" },
                y: 40, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power3.out"
            });

            // Pricing Animations
            gsap.from("#pricing .pricing-header > *", {
                scrollTrigger: { trigger: "#pricing", start: "top 85%", toggleActions: "play none none reverse" },
                y: 40, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power3.out"
            });
            gsap.from(".pricing-card", {
                scrollTrigger: { trigger: "#pricing .grid", start: "top 80%", toggleActions: "play none none reverse" },
                y: 60, opacity: 0, scale: 0.95, duration: 1.2, stagger: 0.15, ease: "expo.out"
            });

            // Testimonial Animations
            gsap.from("#testimonials .testimonials-header > *", {
                scrollTrigger: { trigger: "#testimonials", start: "top 85%", toggleActions: "play none none reverse" },
                y: 40, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power3.out"
            });
            gsap.from(".marquee-container", {
                scrollTrigger: { trigger: "#testimonials .marquee-container", start: "top 85%", toggleActions: "play none none reverse" },
                y: 50, opacity: 0, duration: 1.5, ease: "expo.out"
            });

            // Footer Animations
            gsap.from("footer .footer-content > *", {
                scrollTrigger: { trigger: "footer", start: "top 90%", toggleActions: "play none none reverse" },
                y: 40, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power3.out"
            });

            // Smooth Scrolling Links (Navigasi Antar Halaman)
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    if(isMobileMenuOpen) toggleMobileMenu(); 
                    gsap.to(window, {
                        duration: 1.5, // Durasi gulir lambat dan estetik
                        scrollTo: { y: this.getAttribute('href'), offsetY: 80 }, // offset agar tidak tertutup navbar
                        ease: "power4.inOut" // Easing Cinematic
                    });
                });
            });
        });
