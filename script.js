// Система аутентификации с паролем
document.addEventListener('DOMContentLoaded', function() {
    const CORRECT_PASSWORD = '14.12.2004';
    const LOGIN_KEY = 'love_album_authenticated';
    
    const loginScreen = document.getElementById('loginScreen');
    const mainContent = document.getElementById('mainContent');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    
    // Проверяем, был ли пользователь уже аутентифицирован
    function checkAuthentication() {
        const isAuthenticated = localStorage.getItem(LOGIN_KEY);
        const authTime = localStorage.getItem(LOGIN_KEY + '_time');
        const currentTime = new Date().getTime();
        const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах
        
        // Проверяем, не истёк ли срок аутентификации (30 дней)
        if (isAuthenticated === 'true' && authTime && (currentTime - parseInt(authTime)) < oneMonth) {
            showMainContent();
            return true;
        } else {
            // Очищаем устаревшие данные
            localStorage.removeItem(LOGIN_KEY);
            localStorage.removeItem(LOGIN_KEY + '_time');
            showLoginScreen();
            return false;
        }
    }
    
    // Показать экран входа
    function showLoginScreen() {
        loginScreen.style.display = 'flex';
        mainContent.style.display = 'none';
        passwordInput.focus();
    }
    
    // Показать основной контент
    function showMainContent() {
        loginScreen.classList.add('fadeOut');
        
        setTimeout(() => {
            loginScreen.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Плавное появление основного контента
            setTimeout(() => {
                mainContent.classList.add('show');
            }, 100);
        }, 800);
    }
    
    // Проверка пароля
    function validatePassword(password) {
        return password === CORRECT_PASSWORD;
    }
    
    // Показать сообщение об ошибке
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Анимация тряски поля ввода
        passwordInput.style.animation = 'shake 0.6s ease-in-out';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 600);
        
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
    
    // Обработка входа
    function handleLogin() {
        const password = passwordInput.value.trim();
        
        if (!password) {
            showError('Пожалуйста, введите дату');
            return;
        }
        
        if (validatePassword(password)) {
            // Сохраняем аутентификацию в localStorage
            localStorage.setItem(LOGIN_KEY, 'true');
            localStorage.setItem(LOGIN_KEY + '_time', new Date().getTime().toString());
            
            // Успешная анимация
            loginBtn.style.background = 'linear-gradient(145deg, rgba(34, 197, 94, 0.8), rgba(16, 185, 129, 0.8))';
            loginBtn.innerHTML = '<span>✓ Добро пожаловать!</span>';
            
            setTimeout(() => {
                showMainContent();
            }, 1500);
        } else {
            showError('Неверная дата. Попробуйте ещё раз.');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    
    // Форматирование ввода даты
    function formatDateInput(value) {
        // Удаляем все символы кроме цифр
        const numbers = value.replace(/\D/g, '');
        
        // Форматируем как дд.мм.гггг
        if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 4) {
            return numbers.substring(0, 2) + '.' + numbers.substring(2);
        } else {
            return numbers.substring(0, 2) + '.' + numbers.substring(2, 4) + '.' + numbers.substring(4, 8);
        }
    }
    
    // Обработчики событий
    loginBtn.addEventListener('click', handleLogin);
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    passwordInput.addEventListener('input', function(e) {
        const formatted = formatDateInput(e.target.value);
        e.target.value = formatted;
        
        // Убираем ошибку при вводе
        if (errorMessage.classList.contains('show')) {
            errorMessage.classList.remove('show');
        }
    });
    
    // Добавляем CSS анимацию тряски
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Инициализация
    checkAuthentication();

    // Система переключения тем
    const themeBtn = document.getElementById('themeBtn');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    const htmlElement = document.documentElement;
    
    let isThemeDropdownOpen = false;
    
    // Сохранение темы в localStorage
    function saveTheme(theme) {
        localStorage.setItem('love_album_theme', theme);
    }
    
    // Загрузка темы из localStorage
    function loadTheme() {
        const savedTheme = localStorage.getItem('love_album_theme');
        return savedTheme || 'romantic-pink'; // По умолчанию romantic-pink
    }
    
    // Применение темы
    function applyTheme(theme) {
        // Применяем тему
        htmlElement.setAttribute('data-theme', theme);
        
        // Обновляем активную опцию
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active');
            }
        });
        
        // Сохраняем тему
        saveTheme(theme);
    }
    
    // Переключение выпадающего меню тем
    function toggleThemeDropdown() {
        isThemeDropdownOpen = !isThemeDropdownOpen;
        
        if (isThemeDropdownOpen) {
            themeDropdown.classList.add('show');
            themeBtn.classList.add('active');
        } else {
            themeDropdown.classList.remove('show');
            themeBtn.classList.remove('active');
        }
    }
    
    // Закрытие меню при клике вне его
    function closeThemeDropdownIfOutside(event) {
        if (!themeBtn.contains(event.target) && !themeDropdown.contains(event.target)) {
            if (isThemeDropdownOpen) {
                toggleThemeDropdown();
            }
        }
    }
    
    // Обработчики событий для тем
    themeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleThemeDropdown();
    });
    
    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const selectedTheme = option.getAttribute('data-theme');
            applyTheme(selectedTheme);
            
            // Закрываем меню
            toggleThemeDropdown();
            
            // Добавляем эффект клика
            option.style.transform = 'scale(0.95)';
            option.style.transition = 'transform 0.1s ease';
            setTimeout(() => {
                option.style.transform = '';
                option.style.transition = '';
            }, 100);
        });
    });
    
    // Закрытие меню при клике вне него
    document.addEventListener('click', closeThemeDropdownIfOutside);
    
    // Добавляем класс анимации к основным элементам
    const elementsToAnimate = [
        document.body,
        ...document.querySelectorAll('.login-screen'),
        ...document.querySelectorAll('.main-title'),
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.subtitle'),
        ...document.querySelectorAll('.poem'),
        ...document.querySelectorAll('.poem-number'),
        ...document.querySelectorAll('.nav-btn')
    ];
    
    elementsToAnimate.forEach(element => {
        if (element) {
            element.classList.add('theme-transition');
        }
    });
    
    // Загружаем и применяем сохраненную тему при инициализации
    const savedTheme = loadTheme();
    applyTheme(savedTheme);

// Основная функциональность сайта
// Навигация между секциями
// document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    // Модальное окно для фото
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.getElementById('prevPhoto');
    const nextBtn = document.getElementById('nextPhoto');
    
    // Массив с путями к фотографиям
    const photos = [
        'photos/IMG_2582.jpg',
        'photos/IMG_2594.jpg',
        'photos/IMG_2597.jpg',
        'photos/IMG_4320.jpg',
        'photos/IMG_4353.jpg',
        'photos/IMG_4458.jpg',
        'photos/IMG_4459.jpg',
        'photos/IMG_4464.jpg',
        'photos/IMG_4466.jpg',
        'photos/IMG_4470.jpg',
        'photos/IMG_4485.jpg',
        'photos/IMG_4562.jpg',
        'photos/IMG_4584.jpg',
        'photos/IMG_4621.jpg',
        'photos/IMG_4627.jpg',
        'photos/IMG_4641.jpg',
        'photos/photo_2025-08-06_03-48-42.jpg',
        'photos/photo_2025-08-06_03-48-36.jpg',
        'photos/photo_2025-08-06_03-48-30.jpg',
        'photos/photo_2025-08-06_03-48-26.jpg',
        'photos/photo_2025-08-06_03-48-20.jpg',
        'photos/photo_2025-08-06_03-48-10.jpg'
    ];
    
    let currentPhotoIndex = 0;

    // Функция переключения секций
    function showSection(targetId) {
        // Скрыть все секции
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Показать целевую секцию
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Добавить анимацию появления
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                targetSection.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 50);
        }

        // Обновить активную кнопку навигации
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`[data-target="${targetId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Запустить анимации элементов
        setTimeout(() => {
            animateElements(targetSection);
        }, 300);
    }

    // Обработчики клика для кнопок навигации
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            if (target) {
                showSection(target);
            }
        });
    });

    // Обработчик для кнопки выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Показываем подтверждение
            if (confirm('Вы уверены, что хотите выйти?')) {
                // Очищаем localStorage
                localStorage.removeItem(LOGIN_KEY);
                localStorage.removeItem(LOGIN_KEY + '_time');
                
                // Скрываем основной контент
                mainContent.classList.remove('show');
                
                setTimeout(() => {
                    mainContent.style.display = 'none';
                    loginScreen.style.display = 'flex';
                    loginScreen.classList.remove('fadeOut');
                    
                    // Очищаем поле ввода и возвращаем фокус
                    if (passwordInput) {
                        passwordInput.value = '';
                        passwordInput.focus();
                    }
                    
                    // Возвращаем кнопку в исходное состояние
                    if (loginBtn) {
                        loginBtn.style.background = '';
                        loginBtn.innerHTML = `
                            <span class="login-btn-text">Войти</span>
                            <svg class="login-btn-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                            </svg>
                        `;
                    }
                }, 500);
            }
        });
    }

    // Анимация элементов в секции
    function animateElements(section) {
        const elements = section.querySelectorAll('.photo-item, .video-item, .poem');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.9)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            }, index * 100 + 200);
        });
    }

    // Обработчики для фотографий - открытие модального окна
    document.addEventListener('click', function(e) {
        if (e.target.closest('.photo-item')) {
            e.preventDefault();
            const photoItem = e.target.closest('.photo-item');
            const img = photoItem.querySelector('img');
            if (img) {
                const src = img.getAttribute('src');
                currentPhotoIndex = photos.indexOf(src);
                openModal(src);
            }
        }
    });

    // Функции модального окна
    function openModal(imageSrc) {
        modal.classList.add('active');
        modalImg.src = imageSrc;
        document.body.style.overflow = 'hidden';
        
        // Анимация появления
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        }, 10);
    }

    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.src = photos[currentPhotoIndex];
            modalImg.style.opacity = '1';
        }, 150);
    }

    function showPrevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.src = photos[currentPhotoIndex];
            modalImg.style.opacity = '1';
        }, 150);
    }

    // Обработчики событий для модального окна
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (nextBtn) nextBtn.addEventListener('click', showNextPhoto);
    if (prevBtn) prevBtn.addEventListener('click', showPrevPhoto);

    // Закрытие модального окна при клике вне изображения
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Управление с клавиатуры
    document.addEventListener('keydown', function(e) {
        if (modal && modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    showPrevPhoto();
                    break;
                case 'ArrowRight':
                    showNextPhoto();
                    break;
            }
        }
    });

    // Эффект параллакса для главной страницы
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && document.getElementById('home').classList.contains('active')) {
            const parallax = scrolled * 0.3;
            hero.style.transform = `translateY(${parallax}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);

    // Эффект печатной машинки для заголовка
    function typeWriter(element, text, speed = 120) {
        let i = 0;
        element.innerHTML = '';
        element.style.borderRight = '2px solid rgba(255,255,255,0.7)';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Убрать курсор после завершения
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        type();
    }

    // Запуск эффекта печатной машинки для заголовка
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        setTimeout(() => {
            typeWriter(mainTitle, originalText, 100);
        }, 1000);
    }

    // Инициализация анимаций для первой секции
    setTimeout(() => {
        const homeSection = document.getElementById('home');
        if (homeSection && homeSection.classList.contains('active')) {
            animateElements(homeSection);
        }
    }, 1500);

    // Оптимизация видео - пауза при смене секций
    function pauseAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
        });
    }

    // Добавляем паузу видео при смене секций
    navButtons.forEach(button => {
        button.addEventListener('click', pauseAllVideos);
    });

    // Intersection Observer для ленивой загрузки анимаций
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдение за элементами
    document.querySelectorAll('.photo-item, .video-item, .poem').forEach(el => {
        observer.observe(el);
    });

    // Улучшенное управление тачем для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    modal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 100;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующее фото
                showNextPhoto();
            } else {
                // Свайп вправо - предыдущее фото
                showPrevPhoto();
            }
        }
    }

    // Прелоадер изображений для лучшей производительности
    function preloadImages() {
        photos.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Запуск прелоадера через 2 секунды после загрузки
    setTimeout(preloadImages, 2000);

    // Плавная прокрутка для внутренних элементов
    document.documentElement.style.scrollBehavior = 'smooth';

    // Дополнительные эффекты для навигации
    navButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    // Автоматическое определение ориентации видео
    function setVideoOrientation() {
        const videos = document.querySelectorAll('.video-item video');
        
        videos.forEach(video => {
            video.addEventListener('loadedmetadata', function() {
                const videoItem = this.closest('.video-item');
                const aspectRatio = this.videoWidth / this.videoHeight;
                
                // Удаляем все классы ориентации
                videoItem.classList.remove('landscape', 'portrait', 'square');
                
                if (aspectRatio > 1.3) {
                    // Горизонтальное видео (альбомная ориентация)
                    videoItem.classList.add('landscape');
                } else if (aspectRatio < 0.8) {
                    // Вертикальное видео (портретная ориентация)
                    videoItem.classList.add('portrait');
                } else {
                    // Квадратное или близкое к квадратному
                    videoItem.classList.add('square');
                }
            });
        });
    }

    // Ленивая загрузка видео
    function initVideoLazyLoading() {
        const videos = document.querySelectorAll('video[data-src]');
        
        // Intersection Observer для видео
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    loadVideo(video);
                    videoObserver.unobserve(video);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        videos.forEach(video => {
            videoObserver.observe(video);
        });
    }

    // Загрузка конкретного видео
    function loadVideo(video) {
        const dataSrc = video.getAttribute('data-src');
        if (dataSrc) {
            // Устанавливаем src для video элемента
            video.src = dataSrc;
            
            // Загружаем source элементы
            const sources = video.querySelectorAll('source[data-src]');
            sources.forEach(source => {
                const sourceSrc = source.getAttribute('data-src');
                if (sourceSrc) {
                    source.src = sourceSrc;
                }
            });
            
            // Удаляем data-src атрибуты
            video.removeAttribute('data-src');
            sources.forEach(source => {
                source.removeAttribute('data-src');
            });
            
            // Загружаем видео
            video.load();
        }
    }

    // Предварительная загрузка видео при переходе на вкладку "Видео"
    function preloadVideosOnDemand() {
        const videoSection = document.getElementById('videos');
        let videosLoaded = false;

        // Наблюдаем за активацией секции видео
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.target.classList.contains('active') && !videosLoaded) {
                    videosLoaded = true;
                    
                    // Небольшая задержка для плавности
                    setTimeout(() => {
                        const unloadedVideos = videoSection.querySelectorAll('video[data-src]');
                        unloadedVideos.forEach(video => {
                            loadVideo(video);
                        });
                    }, 500);
                }
            });
        });

        if (videoSection) {
            observer.observe(videoSection, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    // Обработчик клика по видео для мгновенной загрузки
    document.addEventListener('click', function(e) {
        const video = e.target.closest('video[data-src]');
        if (video) {
            loadVideo(video);
        }
    });

    // Показать индикатор загрузки для видео
    function addVideoLoadingIndicators() {
        const videoItems = document.querySelectorAll('.video-item');
        
        videoItems.forEach(item => {
            const video = item.querySelector('video');
            if (video && video.hasAttribute('data-src')) {
                // Создаем индикатор загрузки
                const loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'video-loading-indicator';
                loadingIndicator.innerHTML = `
                    <div class="loading-spinner"></div>
                    <p>Нажмите для загрузки видео</p>
                `;
                
                item.appendChild(loadingIndicator);
                
                // Скрываем индикатор при загрузке видео
                video.addEventListener('loadstart', () => {
                    loadingIndicator.style.opacity = '0';
                    setTimeout(() => {
                        if (loadingIndicator.parentNode) {
                            loadingIndicator.remove();
                        }
                    }, 300);
                });
            }
        });
    }

    // Вызываем функцию определения ориентации
    setVideoOrientation();
    
    // Инициализируем ленивую загрузку
    initVideoLazyLoading();
    preloadVideosOnDemand();
    addVideoLoadingIndicators();

    // Также вызываем при переключении на секцию с видео
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-target="videos"]')) {
            setTimeout(() => {
                setVideoOrientation();
            }, 500);
        }
    });

    // Улучшенный музыкальный плеер
    function setupMusicPlayer() {
        // Плейлист
        const playlist = [
            {
                title: "Каспийский Груз - Любовь",
                src: "Music/Каспийский Груз - Любовь HD1080.mp3"
            },
         
            {
                title: "Скриптонит - Это Любовь",
                src: "Music/Скриптонит - Это Любовь.mp3"
            },
          
            {
                title: "Beckth - Nan Ursyn",
                src: "Music/beckth-nan-ursyn-nan-ұrsyn.mp3"
            }
        ];

        // Элементы плеера
        const musicToggle = document.getElementById('musicToggle');
        const playerControls = document.getElementById('playerControls');
        const backgroundMusic = document.getElementById('backgroundMusic');
        const trackTitle = document.getElementById('trackTitle');
        const progressFill = document.getElementById('progressFill');
        const progressBar = document.getElementById('progressBar');
        const currentTime = document.getElementById('currentTime');
        const totalTime = document.getElementById('totalTime');
        const playPause = document.getElementById('playPause');
        const prevTrack = document.getElementById('prevTrack');
        const nextTrack = document.getElementById('nextTrack');
        const shuffleBtn = document.getElementById('shuffleBtn');
        const volumeSlider = document.getElementById('volumeSlider');

        // Состояние плеера
        let currentTrackIndex = 0;
        let isPlaying = false;
        let isExpanded = false;
        let isShuffled = false;
        let shuffledPlaylist = [...playlist];

        if (!musicToggle || !backgroundMusic) {
            console.log('Элементы музыкального плеера не найдены');
            return;
        }

        // Инициализация
        loadTrack(currentTrackIndex);
        backgroundMusic.volume = 0.6;
        volumeSlider.value = 60;

        // Функция загрузки трека
        function loadTrack(index) {
            const track = isShuffled ? shuffledPlaylist[index] : playlist[index];
            backgroundMusic.src = track.src;
            if (trackTitle) trackTitle.textContent = track.title;
            if (progressFill) progressFill.style.width = '0%';
            if (currentTime) currentTime.textContent = '0:00';
        }

        // Функция форматирования времени
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Функция воспроизведения/паузы
        function togglePlayPause() {
            if (isPlaying) {
                backgroundMusic.pause();
                isPlaying = false;
                musicToggle.classList.remove('playing');
                if (playPause) playPause.classList.remove('playing');
            } else {
                backgroundMusic.play().catch(error => {
                    console.log('Ошибка воспроизведения:', error);
                });
                isPlaying = true;
                musicToggle.classList.add('playing');
                if (playPause) playPause.classList.add('playing');
            }
        }

        // Функция переключения к следующему треку
        function nextTrackFunc() {
            if (isShuffled) {
                currentTrackIndex = (currentTrackIndex + 1) % shuffledPlaylist.length;
            } else {
                currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            }
            loadTrack(currentTrackIndex);
            if (isPlaying) {
                backgroundMusic.play().catch(error => {
                    console.log('Ошибка воспроизведения:', error);
                });
            }
        }

        // Функция переключения к предыдущему треку
        function prevTrackFunc() {
            if (isShuffled) {
                currentTrackIndex = (currentTrackIndex - 1 + shuffledPlaylist.length) % shuffledPlaylist.length;
            } else {
                currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            }
            loadTrack(currentTrackIndex);
            if (isPlaying) {
                backgroundMusic.play().catch(error => {
                    console.log('Ошибка воспроизведения:', error);
                });
            }
        }

        // Функция перемешивания
        function shufflePlaylist() {
            isShuffled = !isShuffled;
            if (shuffleBtn) {
                shuffleBtn.classList.toggle('active', isShuffled);
            }
            
            if (isShuffled) {
                // Перемешиваем плейлист
                shuffledPlaylist = [...playlist];
                for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
                }
                // Находим текущий трек в перемешанном плейлисте
                const currentTrack = playlist[currentTrackIndex];
                currentTrackIndex = shuffledPlaylist.findIndex(track => track.src === currentTrack.src);
            } else {
                // Возвращаемся к обычному плейлисту
                const currentTrack = shuffledPlaylist[currentTrackIndex];
                currentTrackIndex = playlist.findIndex(track => track.src === currentTrack.src);
            }
        }

        // Переключение расширенной панели
        musicToggle.addEventListener('click', () => {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
                if (playerControls) playerControls.classList.add('active');
                musicToggle.classList.add('expanded');
            } else {
                if (playerControls) playerControls.classList.remove('active');
                musicToggle.classList.remove('expanded');
            }
        });

        // Обработчики кнопок плеера
        if (playPause) {
            playPause.addEventListener('click', togglePlayPause);
        }

        if (nextTrack) {
            nextTrack.addEventListener('click', nextTrackFunc);
        }

        if (prevTrack) {
            prevTrack.addEventListener('click', prevTrackFunc);
        }

        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', shufflePlaylist);
        }

        // Обработчик громкости
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                backgroundMusic.volume = e.target.value / 100;
            });
        }

        // Обработчик прогресс-бара
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                backgroundMusic.currentTime = percent * backgroundMusic.duration;
            });
        }

        // Обновление прогресса
        backgroundMusic.addEventListener('timeupdate', () => {
            if (backgroundMusic.duration) {
                const percent = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
                if (progressFill) progressFill.style.width = percent + '%';
                if (currentTime) currentTime.textContent = formatTime(backgroundMusic.currentTime);
            }
        });

        // Обновление общего времени
        backgroundMusic.addEventListener('loadedmetadata', () => {
            if (totalTime) totalTime.textContent = formatTime(backgroundMusic.duration);
        });

        // Автоматический переход к следующему треку
        backgroundMusic.addEventListener('ended', () => {
            nextTrackFunc();
        });

        // Закрытие панели при клике вне её
        document.addEventListener('click', (e) => {
            if (isExpanded && !e.target.closest('.music-player')) {
                isExpanded = false;
                if (playerControls) playerControls.classList.remove('active');
                musicToggle.classList.remove('expanded');
            }
        });

        // Управление с клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                togglePlayPause();
            }
        });
    }

    // Инициализация музыкального плеера
    setTimeout(() => {
        setupMusicPlayer();
    }, 1000);
}); 