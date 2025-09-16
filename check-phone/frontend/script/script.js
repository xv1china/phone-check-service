// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    const html = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function () {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    // Mobile menu functionality
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');

    burgerMenu.addEventListener('click', function () {
        navLinks.classList.toggle('show');
        burgerMenu.classList.toggle('active');
    });

    navLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('show');
            burgerMenu.classList.remove('active');
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const responseMessage = document.getElementById('responseMessage');
    contactForm.addEventListener('change', function (e) {
        const target = e.target;
        console.log(target.name, target.value);
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const address = formData.get('address');
        const city = formData.get('city');
        const model = formData.get('model');
        const plan1 = formData.get('plan1');
        const plan2 = formData.get('plan2');
        const service = formData.get('service'); // დამატებულია
        const website = formData.get('website'); // Honeypot

        console.log(formData.get('service')); // გადაამოწმეთ კონსოლში



        if (plan1) {
            formData.set('plan', plan1);

        }

        if (plan2) {
            formData.set('plan', plan2);
        }

        // if (!name || !phone || !address || !model || !city || !plan1 || !plan2 || !service) {
        //     showMessage('გთხოვთ შეავსოთ ყველა ველი', 'error');
        //     return;

        // }



        const phoneRegex = /^(\+995|995|0)?[1-9]\d{8}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showMessage('გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი', 'error');
            return;
        }

        showMessage('მუშაობს...', 'loading');

        console.log(formData.get('plan')); // გადაამოწმეთ კონსოლში



        fetch('http://localhost:3000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
                city: city.trim(),
                model: model.trim(),
                plan: formData.get('plan1') || formData.get('plan2'), // აქ გადადის
                service: service, // აქ გადადის
                website: website
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showMessage('✅ მადლობა! თქვენი განცხადება წარმატებით გაიგზავნა.', 'success');
                    contactForm.reset();
                } else {
                    showMessage('❌ შეცდომა: ' + (data.message || 'სცადეთ მოგვიანებით'), 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('❌ კავშირის შეცდომა. სცადეთ მოგვიანებით.', 'error');
            });
    });

    function showMessage(text, type) {
        responseMessage.textContent = text;
        responseMessage.className = `response-message show ${type}`;

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                responseMessage.classList.remove('show');
            }, 10);
        }
    }


    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.package-card, .section-title').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroHeight = hero.offsetHeight;
        if (scrolled < heroHeight) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(-8px) scale(1)';
        });
    });

    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });
});
