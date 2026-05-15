
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        // --- MOBILE MENU LOGIC ---
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        let isMobileMenuOpen = false;

        function toggleMobileMenu() {
            isMobileMenuOpen = !isMobileMenuOpen;
            if (isMobileMenuOpen) {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => mobileMenu.classList.remove('opacity-0'), 10);
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.add('opacity-0');
                setTimeout(() => mobileMenu.classList.add('hidden'), 300);
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars-staggered"></i>';
                document.body.style.overflow = 'auto';
            }
        }

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if(isMobileMenuOpen) toggleMobileMenu();
            });
        });

        // --- CINEMATIC THEME TOGGLE ---
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
            
            themeIconDesktop.style.transform = isDark ? 'rotate(360deg)' : 'rotate(-360deg)';
            themeIconMobile.style.transform = isDark ? 'rotate(360deg)' : 'rotate(-360deg)';
            
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
                        duration: 1200,
                        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                        pseudoElement: '::view-transition-new(root)'
                    }
                );
            });
        }

        themeBtnDesktop.addEventListener('click', handleThemeClick);
        themeBtnMobile.addEventListener('click', handleThemeClick);

        // --- PRICING TOGGLE LOGIC ---
        const btnFoto = document.getElementById('toggle-foto');
        const btnVideo = document.getElementById('toggle-video');
        const fotoContents = document.querySelectorAll('.pricing-content-foto');
        const videoContents = document.querySelectorAll('.pricing-content-video');

        function switchPricing(mode) {
            if(mode === 'foto') {
                btnFoto.classList.add('bg-[var(--text-main)]', 'text-[var(--bg-main)]');
                btnFoto.classList.remove('text-[var(--text-muted)]');
                
                btnVideo.classList.remove('bg-[var(--text-main)]', 'text-[var(--bg-main)]');
                btnVideo.classList.add('text-[var(--text-muted)]');

                videoContents.forEach(el => el.classList.add('hidden'));
                fotoContents.forEach(el => {
                    el.classList.remove('hidden');
                    gsap.fromTo(el, {opacity: 0, y: 15}, {opacity: 1, y: 0, duration: 0.5, ease: "power2.out"});
                });

            } else {
                btnVideo.classList.add('bg-[var(--text-main)]', 'text-[var(--bg-main)]');
                btnVideo.classList.remove('text-[var(--text-muted)]');
                
                btnFoto.classList.remove('bg-[var(--text-main)]', 'text-[var(--bg-main)]');
                btnFoto.classList.add('text-[var(--text-muted)]');

                fotoContents.forEach(el => el.classList.add('hidden'));
                videoContents.forEach(el => {
                    el.classList.remove('hidden');
                    gsap.fromTo(el, {opacity: 0, y: 15}, {opacity: 1, y: 0, duration: 0.5, ease: "power2.out"});
                });
            }
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
            const scrollAmount = window.innerWidth < 768 ? 260 : 300; 
            slider.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
        }

        // Tampilkan tombol statis saja dan hapus opsi click ganda agar animasi fokus
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
                imgElement.className = 'masonry-item rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-lg border border-[var(--border-color)] opacity-0 translate-y-8 group relative bg-[var(--bg-card)] cursor-pointer';
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
            setTimeout(() => {
                galleryModal.classList.remove('opacity-0');
                modalContentGallery.classList.remove('scale-95');
                gsap.to('.masonry-item', { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" });
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

        // --- SCROLL ANIMATIONS ---
        window.addEventListener('load', () => {
            window.addEventListener('scroll', () => {
                const nav = document.getElementById('main-nav');
                if (window.scrollY > 50) nav.classList.add('nav-blur');
                else nav.classList.remove('nav-blur');
            });

            gsap.from(".hero-content > *", { y: 40, opacity: 0, duration: 1.5, stagger: 0.15, ease: "power3.out" });

            // Pricing Animations
            gsap.from("#pricing .pricing-header > *", {
                scrollTrigger: { trigger: "#pricing", start: "top 85%", toggleActions: "play none none reverse" },
                y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out"
            });
            gsap.from(".pricing-card", {
                scrollTrigger: { trigger: "#pricing .grid", start: "top 80%", toggleActions: "play none none reverse" },
                y: 60, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
            });

            // Testimonial Animations
            gsap.from("#testimonials .testimonials-header > *", {
                scrollTrigger: { trigger: "#testimonials", start: "top 85%", toggleActions: "play none none reverse" },
                y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out"
            });
            gsap.from(".marquee-container", {
                scrollTrigger: { trigger: "#testimonials .marquee-container", start: "top 85%", toggleActions: "play none none reverse" },
                y: 60, opacity: 0, duration: 1.2, ease: "power3.out"
            });

            // Footer Animations
            gsap.from("footer .footer-content > *", {
                scrollTrigger: { trigger: "footer", start: "top 90%", toggleActions: "play none none reverse" },
                y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out"
            });

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    if(isMobileMenuOpen) toggleMobileMenu(); 
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: { y: this.getAttribute('href'), offsetY: 80 },
                        ease: "power3.inOut"
                    });
                });
            });
        });