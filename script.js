document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            
            // Add mobile nav styles dynamically when toggled
            if (navLinks.classList.contains('show')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                navLinks.style.padding = '20px';
                navLinks.style.zIndex = '1000';
            } else {
                navLinks.style.display = '';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation and submission
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            
            if (!name || !email || !date || !time || !guests) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Date validation (ensure it's not in the past)
            const selectedDate = new Date(date);
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
    
    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.feature, .cat-card, .info-card');
    
    const revealOnScroll = function() {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    };
    
    // Add CSS for reveal animation
    const style = document.createElement('style');
    style.textContent = `
        .feature, .cat-card, .info-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .feature.active, .cat-card.active, .info-card.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on initial load
    
    // Add sticky navigation on scroll
    const nav = document.querySelector('nav');
    
    const makeNavSticky = function() {
        if (window.scrollY > 100) {
            nav.style.position = 'fixed';
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            nav.style.padding = '15px 5%';
            nav.style.transition = 'all 0.3s ease';
        } else {
            nav.style.position = 'absolute';
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            nav.style.boxShadow = 'none';
            nav.style.padding = '20px 5%';
        }
    };
    
    window.addEventListener('scroll', makeNavSticky);
    
    // Current year for copyright
    const copyrightYear = document.querySelector('.copyright p');
    if (copyrightYear) {
        const year = new Date().getFullYear();
        copyrightYear.innerHTML = `&copy; ${year} Whiskers & Lattes. All rights reserved.`;
    }
    
    // Gallery image lazy loading
    const catImages = document.querySelectorAll('.cat-image img');
    if ('loading' in HTMLImageElement.prototype) {
        catImages.forEach(img => {
            img.loading = 'lazy';
        });
    }
    
    // Cat Profile Modal Functionality
    const catCards = document.querySelectorAll('.cat-card');
    const catProfileBtns = document.querySelectorAll('.cat-profile-btn');
    const modalOverlay = document.getElementById('cat-modal-overlay');
    const catModals = document.querySelectorAll('.cat-modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    
    // Open modal when clicking on a cat card or Learn More button
    catProfileBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const catCard = this.closest('.cat-card');
            const catId = catCard.dataset.catId;
            
            openCatModal(catId);
        });
    });
    
    catCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.cat-profile-btn')) {
                const catId = this.dataset.catId;
                openCatModal(catId);
            }
        });
    });
    
    // Close modal when clicking the close button or outside the modal
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    modalOverlay.addEventListener('click', closeAllModals);
    
    // Close modal when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Functions to open and close modals
    function openCatModal(catId) {
        const modal = document.getElementById(`${catId}-profile`);
        
        if (modal) {
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
            
            // Show overlay and modal
            modalOverlay.classList.add('active');
            modal.classList.add('active');
            
            // Add animation classes
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }
    }
    
    function closeAllModals() {
        // Re-enable body scrolling
        document.body.style.overflow = '';
        
        // Hide all modals and overlay
        modalOverlay.classList.remove('active');
        
        catModals.forEach(modal => {
            modal.classList.remove('active');
            modal.classList.remove('show');
        });
    }
    
    // Custom Date Picker Implementation
    const dateDisplay = document.getElementById('date-display');
    const dateInput = document.getElementById('date');
    const calendarToggle = document.querySelector('.calendar-toggle');
    const calendarDropdown = document.querySelector('.calendar-dropdown');
    const calendarDays = document.querySelector('.calendar-days');
    const currentMonthElement = document.querySelector('.current-month');
    const prevMonthButton = document.querySelector('.prev-month');
    const nextMonthButton = document.querySelector('.next-month');
    const clearButton = document.querySelector('.calendar-clear');
    const todayButton = document.querySelector('.calendar-today');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;
    
    // Initialize the calendar
    function initCalendar() {
        updateCalendarHeader();
        generateCalendarDays();
        
        // Event listeners
        calendarToggle.addEventListener('click', toggleCalendar);
        dateDisplay.addEventListener('click', toggleCalendar);
        prevMonthButton.addEventListener('click', goToPrevMonth);
        nextMonthButton.addEventListener('click', goToNextMonth);
        clearButton.addEventListener('click', clearDate);
        todayButton.addEventListener('click', goToToday);
        
        // Close calendar when clicking outside
        document.addEventListener('click', function(e) {
            if (!calendarDropdown.contains(e.target) && 
                !calendarToggle.contains(e.target) && 
                !dateDisplay.contains(e.target)) {
                calendarDropdown.classList.remove('active');
            }
        });
    }
    
    function updateCalendarHeader() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${months[currentMonth]} ${currentYear}`;
    }
    
    function generateCalendarDays() {
        calendarDays.innerHTML = '';
        
        // Get the first day of the month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        
        // Get the last day of the month
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Get the last day of the previous month
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        
        // Calendar grid has 42 cells (6 rows × 7 days)
        const totalDays = 42;
        
        // Current date for highlighting today
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();
        
        // Fill the calendar grid
        for (let i = 0; i < totalDays; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            
            // Previous month days
            if (i < firstDay) {
                const day = prevMonthLastDay - firstDay + i + 1;
                dayElement.textContent = day;
                dayElement.classList.add('other-month');
                dayElement.dataset.date = formatDate(new Date(currentYear, currentMonth - 1, day));
                
                // Disable past days
                if (currentYear <= todayYear && currentMonth - 1 < todayMonth) {
                    dayElement.classList.add('disabled');
                } else if (currentYear < todayYear) {
                    dayElement.classList.add('disabled');
                }
            } 
            // Current month days
            else if (i < firstDay + lastDay) {
                const day = i - firstDay + 1;
                dayElement.textContent = day;
                dayElement.dataset.date = formatDate(new Date(currentYear, currentMonth, day));
                
                // Check if this day is today
                if (day === todayDate && currentMonth === todayMonth && currentYear === todayYear) {
                    dayElement.classList.add('today');
                }
                
                // Check if this day is selected
                if (selectedDate === dayElement.dataset.date) {
                    dayElement.classList.add('selected');
                }
                
                // Disable past days
                if (currentYear === todayYear && currentMonth === todayMonth && day < todayDate) {
                    dayElement.classList.add('disabled');
                } else if (currentYear <= todayYear && currentMonth < todayMonth) {
                    dayElement.classList.add('disabled');
                } else if (currentYear < todayYear) {
                    dayElement.classList.add('disabled');
                }
            } 
            // Next month days
            else {
                const day = i - (firstDay + lastDay) + 1;
                dayElement.textContent = day;
                dayElement.classList.add('other-month');
                dayElement.dataset.date = formatDate(new Date(currentYear, currentMonth + 1, day));
            }
            
            // Add click event to select date
            if (!dayElement.classList.contains('disabled')) {
                dayElement.addEventListener('click', function() {
                    selectDate(this.dataset.date, this);
                });
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    function toggleCalendar() {
        calendarDropdown.classList.toggle('active');
    }
    
    function goToPrevMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendarHeader();
        generateCalendarDays();
    }
    
    function goToNextMonth() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendarHeader();
        generateCalendarDays();
    }
    
    function goToToday() {
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        updateCalendarHeader();
        generateCalendarDays();
        
        // Select today's date if it's not in the past
        const todayStr = formatDate(today);
        selectDate(todayStr);
    }
    
    function clearDate() {
        selectedDate = null;
        dateDisplay.value = '';
        dateInput.value = '';
        
        // Remove selected class from all days
        const selectedDay = document.querySelector('.calendar-day.selected');
        if (selectedDay) {
            selectedDay.classList.remove('selected');
        }
    }
    
    function selectDate(dateStr, element) {
        selectedDate = dateStr;
        dateInput.value = dateStr;
        
        // Format the display date
        const [year, month, day] = dateStr.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dateDisplay.value = `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
        
        // Update selected class
        const selectedDay = document.querySelector('.calendar-day.selected');
        if (selectedDay) {
            selectedDay.classList.remove('selected');
        }
        
        // If element is provided, add selected class
        if (element) {
            element.classList.add('selected');
        } else {
            // Find the element with the matching date
            const allDays = document.querySelectorAll('.calendar-day');
            allDays.forEach(day => {
                if (day.dataset.date === dateStr) {
                    day.classList.add('selected');
                }
            });
        }
        
        // Close the calendar dropdown
        calendarDropdown.classList.remove('active');
    }
    
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Initialize the calendar if the elements exist
    if (dateDisplay && calendarDropdown) {
        initCalendar();
    }
    
    // Custom Time Picker Implementation
    const timeDisplay = document.getElementById('time-display');
    const timeInput = document.getElementById('time');
    const timeToggle = document.querySelector('.time-toggle');
    const timeDropdown = document.querySelector('.time-dropdown');
    const timeOptions = document.querySelectorAll('.time-option');
    
    function initTimePicker() {
        // Event listeners
        timeToggle.addEventListener('click', toggleTimeDropdown);
        timeDisplay.addEventListener('click', toggleTimeDropdown);
        
        // Add click event to each time option
        timeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const time = this.dataset.time;
                const displayText = this.textContent;
                
                // Update the inputs
                timeInput.value = time;
                timeDisplay.value = displayText;
                
                // Update selected class
                timeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // Close the dropdown
                timeDropdown.classList.remove('active');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!timeDropdown.contains(e.target) && 
                !timeToggle.contains(e.target) && 
                !timeDisplay.contains(e.target)) {
                timeDropdown.classList.remove('active');
            }
        });
    }
    
    function toggleTimeDropdown() {
        timeDropdown.classList.toggle('active');
        
        // Close calendar dropdown if open
        if (calendarDropdown && calendarDropdown.classList.contains('active')) {
            calendarDropdown.classList.remove('active');
        }
    }
    
    // Initialize the time picker if the elements exist
    if (timeDisplay && timeDropdown) {
        initTimePicker();
    }
}); 