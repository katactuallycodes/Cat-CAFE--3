document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements to avoid repeated queries
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('nav');
    const anchors = document.querySelectorAll('a[href^="#"]');
    const bookingForm = document.getElementById('booking-form');
    const copyrightYear = document.querySelector('.copyright p');
    
    // Performance: Use passive event listeners and debounce scroll events
    let scrollDebounce;
    let lastScrollY = 0;
    let ticking = false;
    
    // Mobile navigation toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            
            // Performance: Use classList.toggle conditional return value
            const isShowing = navLinks.classList.contains('show');
            
            // Add mobile nav styles dynamically when toggled
            if (isShowing) {
                // Performance: Apply styles only when needed
                requestAnimationFrame(() => {
                    navLinks.style.display = 'flex';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '70px';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                    navLinks.style.padding = '20px';
                    navLinks.style.zIndex = '1000';
                });
            } else {
                navLinks.style.display = '';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Close mobile nav if it's open
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                navLinks.style.display = '';
            }
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Performance: Use more efficient scroll method
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation and submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Cache form elements for better performance
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            const guests = document.getElementById('guests');
            
            // Basic form validation - only validate what's necessary
            if (!name.value || !email.value || !date.value || !time.value || !guests.value) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Date validation (ensure it's not in the past)
            const selectedDate = new Date(date.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alert('Please select a future date for your visit.');
                return;
            }
            
            // Normally would submit to server here
            // For demo purposes, just show a success message
            alert('Thank you for your booking! We look forward to seeing you and your friends at Whiskers & Lattes.');
            bookingForm.reset();
        });
    }
    
    // Scroll reveal animation - Optimized with IntersectionObserver
    const revealElements = document.querySelectorAll('.feature, .cat-card, .info-card');
    
    // Performance: Add CSS via stylesheet instead of inline
    if (revealElements.length > 0) {
        // Add CSS for reveal animation
        const style = document.createElement('style');
        style.textContent = `
            .feature, .cat-card, .info-card {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
                will-change: opacity, transform;
            }
            .feature.active, .cat-card.active, .info-card.active {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
        
        // Use IntersectionObserver instead of scroll event for better performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        // Once the animation is triggered, we don't need to observe it anymore
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px 50px 0px' // Load slightly before coming into view
            });
            
            // Performance: Use requestIdleCallback to observe elements when the browser is idle
            if (window.requestIdleCallback) {
                requestIdleCallback(() => {
                    revealElements.forEach(element => {
                        observer.observe(element);
                    });
                });
            } else {
                // Fallback for browsers that don't support requestIdleCallback
                revealElements.forEach(element => {
                    observer.observe(element);
                });
            }
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            // Apply active class to all elements immediately
            revealElements.forEach(element => {
                element.classList.add('active');
            });
        }
    }
    
    // Add sticky navigation on scroll - Optimized with throttle
    function updateNav() {
        if (window.scrollY > 100) {
            nav.style.position = 'fixed';
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            nav.style.padding = '15px 5%';
        } else {
            nav.style.position = 'absolute';
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            nav.style.boxShadow = 'none';
            nav.style.padding = '20px 5%';
        }
        ticking = false;
    }
    
    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNav();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Performance: Use passive event listener and load it only if nav exists
    if (nav) {
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    
    // Current year for copyright - only run this once
    if (copyrightYear) {
        const year = new Date().getFullYear();
        copyrightYear.innerHTML = `&copy; ${year} Whiskers & Lattes. All rights reserved.`;
    }
    
    // Performance: Delegate event listeners for modals
    const modalOverlay = document.getElementById('cat-modal-overlay');
    
    // Use event delegation for cat cards
    document.addEventListener('click', function(e) {
        // Handle cat profile buttons
        if (e.target.matches('.cat-profile-btn') || e.target.closest('.cat-profile-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const catCard = e.target.closest('.cat-card');
            if (catCard) {
                const catId = catCard.dataset.catId;
                openCatModal(catId);
            }
        }
        // Handle cat card clicks
        else if (e.target.closest('.cat-card') && !e.target.closest('.cat-profile-btn')) {
            const catCard = e.target.closest('.cat-card');
            const catId = catCard.dataset.catId;
            openCatModal(catId);
        }
        // Handle modal close button
        else if (e.target.matches('.modal-close') || e.target.closest('.modal-close')) {
            closeAllModals();
        }
    });
    
    // Only add overlay click handler if overlay exists
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeAllModals();
            }
        });
    }
    
    function openCatModal(catId) {
        const catModal = document.querySelector(`.cat-modal[data-cat-id="${catId}"]`);
        if (!catModal) return;
        
        if (modalOverlay) {
            modalOverlay.classList.add('active');
        }
        
        catModal.classList.add('active');
        
        // Performance: Mark the body to prevent scrolling in a more efficient way
        document.body.style.overflow = 'hidden';
    }
    
    function closeAllModals() {
        const activeModals = document.querySelectorAll('.cat-modal.active');
        
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
        
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }
    
    // Calendar initialization - only when necessary
    const calendarContainer = document.querySelector('.custom-date-picker');
    if (calendarContainer) {
        initCalendar();
    }
    
    // Time picker initialization - only when necessary
    const timePickerContainer = document.querySelector('.custom-time-picker');
    if (timePickerContainer) {
        initTimePicker();
    }
    
    function initCalendar() {
        // Calendar variables
        const dateInput = document.getElementById('date');
        const calendarToggle = document.querySelector('.calendar-toggle');
        const calendarDropdown = document.querySelector('.calendar-dropdown');
        const prevMonthBtn = document.querySelector('.prev-month');
        const nextMonthBtn = document.querySelector('.next-month');
        const currentMonthElement = document.querySelector('.current-month');
        const calendarDaysElement = document.querySelector('.calendar-days');
        const todayBtn = document.querySelector('.calendar-today');
        const clearBtn = document.querySelector('.calendar-clear');
        
        let currentDate = new Date();
        let selectedDate = null;
        
        // Only attach listeners if elements exist
        if (calendarToggle && calendarDropdown) {
            calendarToggle.addEventListener('click', toggleCalendar);
            
            if (prevMonthBtn) prevMonthBtn.addEventListener('click', goToPrevMonth);
            if (nextMonthBtn) nextMonthBtn.addEventListener('click', goToNextMonth);
            if (todayBtn) todayBtn.addEventListener('click', goToToday);
            if (clearBtn) clearBtn.addEventListener('click', clearDate);
            
            // Initial calendar render
            updateCalendarHeader();
            generateCalendarDays();
        }
    }
    
    function updateCalendarHeader() {
        const currentMonthElement = document.querySelector('.current-month');
        if (currentMonthElement) {
            currentMonthElement.textContent = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
    }
    
    function generateCalendarDays() {
        const calendarDaysElement = document.querySelector('.calendar-days');
        if (!calendarDaysElement) return;
        
        calendarDaysElement.innerHTML = '';
        
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Calculate days from previous month to display
        let firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Calculate days from next month to display
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex - 1;
        
        // Current date for highlighting today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Previous month's days
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        
        for (let i = firstDayIndex; i > 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day', 'empty', 'other-month');
            dayElement.textContent = prevMonthLastDay - i + 1;
            calendarDaysElement.appendChild(dayElement);
        }
        
        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            
            const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            dateToCheck.setHours(0, 0, 0, 0);
            
            // Check if it's today
            if (dateToCheck.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }
            
            // Check if it's the selected date
            if (selectedDate && dateToCheck.getTime() === selectedDate.getTime()) {
                dayElement.classList.add('selected');
            }
            
            // Check if it's in the past
            if (dateToCheck < today) {
                dayElement.classList.add('disabled');
            } else {
                // Only add event listeners to future dates
                dayElement.addEventListener('click', function() {
                    selectDate(dateToCheck, dayElement);
                });
            }
            
            calendarDaysElement.appendChild(dayElement);
        }
        
        // Next month's days
        for (let i = 1; i <= nextDays; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day', 'empty', 'other-month');
            dayElement.textContent = i;
            calendarDaysElement.appendChild(dayElement);
        }
    }
    
    function toggleCalendar() {
        const calendarDropdown = document.querySelector('.calendar-dropdown');
        if (calendarDropdown) {
            calendarDropdown.classList.toggle('active');
        }
    }
    
    function goToPrevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendarHeader();
        generateCalendarDays();
    }
    
    function goToNextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendarHeader();
        generateCalendarDays();
    }
    
    function goToToday() {
        currentDate = new Date();
        updateCalendarHeader();
        generateCalendarDays();
    }
    
    function clearDate() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.value = '';
            selectedDate = null;
            generateCalendarDays();
        }
        
        const calendarDropdown = document.querySelector('.calendar-dropdown');
        if (calendarDropdown) {
            calendarDropdown.classList.remove('active');
        }
    }
    
    function selectDate(dateStr, element) {
        const dateInput = document.getElementById('date');
        
        // Clear previous selection
        const prevSelected = document.querySelector('.calendar-day.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }
        
        // Add selection to clicked date
        element.classList.add('selected');
        
        // Set the date
        selectedDate = new Date(dateStr);
        
        if (dateInput) {
            // Format the date as YYYY-MM-DD for the input
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            dateInput.value = `${year}-${month}-${day}`;
        }
        
        // Close the calendar dropdown
        const calendarDropdown = document.querySelector('.calendar-dropdown');
        if (calendarDropdown) {
            calendarDropdown.classList.remove('active');
        }
    }
    
    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    function initTimePicker() {
        // Time picker elements
        const timeInput = document.getElementById('time');
        const timeToggle = document.querySelector('.time-toggle');
        const timeDropdown = document.querySelector('.time-dropdown');
        const timeOptions = document.querySelector('.time-options');
        
        // Only proceed if elements exist
        if (!timeToggle || !timeDropdown || !timeOptions) return;
        
        // Add time slots (9 AM to 8 PM, 30 min intervals)
        const startHour = 9; // 9 AM
        const endHour = 20; // 8 PM
        
        // Create the time options more efficiently
        let timeOptionsHTML = '';
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += 30) {
                const period = hour >= 12 ? 'PM' : 'AM';
                let displayHour = hour > 12 ? hour - 12 : hour;
                if (displayHour === 0) displayHour = 12; // Handle midnight/noon
                
                const displayMinutes = minutes.toString().padStart(2, '0');
                const timeDisplay = `${displayHour}:${displayMinutes} ${period}`;
                const timeValue = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                
                timeOptionsHTML += `<div class="time-option" data-value="${timeValue}">${timeDisplay}</div>`;
            }
        }
        
        timeOptions.innerHTML = timeOptionsHTML;
        
        // Add event listeners
        timeToggle.addEventListener('click', toggleTimeDropdown);
        
        // Use event delegation for time options
        timeOptions.addEventListener('click', function(e) {
            const timeOption = e.target.closest('.time-option');
            if (timeOption) {
                const value = timeOption.dataset.value;
                if (timeInput) timeInput.value = value;
                
                const prevSelected = timeOptions.querySelector('.time-option.selected');
                if (prevSelected) prevSelected.classList.remove('selected');
                
                timeOption.classList.add('selected');
                timeDropdown.classList.remove('active');
            }
        });
    }
    
    function toggleTimeDropdown() {
        const timeDropdown = document.querySelector('.time-dropdown');
        if (timeDropdown) {
            timeDropdown.classList.toggle('active');
        }
    }
}); 