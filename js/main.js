// ================= Load Sections Dynamically =================
const sections = ['home', 'whatido', 'reflection', 'notes', 'footer'];
const container = document.getElementById('sections-container');

if (!container) {
  console.error('ERROR: #sections-container not found in HTML!');
} else {
  console.log('Loading sections in order...');
  
  // Load sections sequentially (in order)
  let sectionIndex = 0;
  
  function loadNextSection() {
    if (sectionIndex >= sections.length) {
      console.log('✓ All sections loaded');
      return;
    }
    
    const section = sections[sectionIndex];
    console.log(`Fetching: sections/${section}.html`);
    
    fetch(`sections/${section}.html`)
      .then(res => {
        console.log(`Response for ${section}.html:`, res.status);
        if (!res.ok) throw new Error(`Failed to load ${section}.html: ${res.status}`);
        return res.text();
      })
      .then(data => {
        console.log(`Successfully loaded ${section}.html`);
        container.innerHTML += data;
        
        // Initialize animations after section is added
        if(section==='home') setTimeout(() => initHomeAnimations(), 100);
        if(section==='footer') setTimeout(() => initQuizModal(), 100);
        
        sectionIndex++;
        loadNextSection(); // Load next section
      })
      .catch(error => {
        console.error(`Error loading section ${section}:`, error);
        sectionIndex++;
        loadNextSection(); // Skip to next section if error
      });
  }
  
  loadNextSection(); // Start loading
}

// ================= Home Section Animations =================
function initHomeAnimations(){
  console.log('initHomeAnimations called');
  
  // Typed.js animation with retry logic
  const typedElement = document.getElementById('typed');
  if (!typedElement) {
    console.error('ERROR: #typed element not found!');
    return;
  }

  // Check if Typed library is loaded, with retry
  if (typeof Typed === 'undefined') {
    console.warn('Typed.js not loaded yet, retrying...');
    setTimeout(() => initHomeAnimations(), 500);
    return;
  }

  try {
    new Typed('#typed', {
      strings: ["Engineer", "Table Tennis Coach", "Problem Solver", "Lifelong Learner"],
      typeSpeed: 80,
      backSpeed: 50,
      loop: true
    });
    console.log('✓ Typed.js animation initialized');
  } catch(e) {
    console.error('ERROR initializing Typed.js:', e);
  }

  // Profile photo slider
  const profilePhoto = document.getElementById('profilePhoto');
  if (!profilePhoto) {
    console.error('ERROR: #profilePhoto element not found!');
    return;
  }

  const photos = ['images/profile.jpg', 'images/profile_cartoon.png'];
  let currentIndex = 0;
  
  const photoInterval = setInterval(()=>{
    if (profilePhoto && profilePhoto.parentElement) {
      currentIndex = (currentIndex + 1) % photos.length;
      profilePhoto.src = photos[currentIndex];
      console.log('Profile photo updated to:', photos[currentIndex]);
    } else {
      clearInterval(photoInterval);
    }
  }, 3000);

  console.log('✓ Home animations initialized successfully');
}

// ================= Quiz Modal Data =================
const quizData = {
  cpp: {
    title: 'C++ Basics Quiz',
    question: 'What does the "int" keyword declare?',
    options: [
      'A variable that stores integers',
      'A variable that stores text',
      'A function declaration',
      'A class definition'
    ],
    correct: 0
  },
  logic: {
    title: 'Logic & Problem Solving Quiz',
    question: 'What is the first step in problem-solving?',
    options: [
      'Start coding immediately',
      'Understand the problem',
      'Test the solution',
      'Optimize the code'
    ],
    correct: 1
  },
  dsa: {
    title: 'Data Structures & Algorithms Quiz',
    question: 'Which data structure uses LIFO (Last In First Out)?',
    options: [
      'Queue',
      'Stack',
      'Array',
      'Tree'
    ],
    correct: 1
  }
};

let selectedAnswer = null;

// ================= Quiz Modal Functions =================
function openQuizModal(cardType) {
  const quiz = quizData[cardType];
  const modal = document.getElementById('quizModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalOptions = document.getElementById('modalOptions');
  
  modalTitle.textContent = quiz.title;
  modalBody.textContent = quiz.question;
  modalOptions.innerHTML = '';
  selectedAnswer = null;
  
  quiz.options.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.className = 'modal-option';
    optionBtn.textContent = option;
    optionBtn.addEventListener('click', () => {
      document.querySelectorAll('.modal-option').forEach(btn => btn.classList.remove('selected'));
      optionBtn.classList.add('selected');
      selectedAnswer = index;
    });
    modalOptions.appendChild(optionBtn);
  });
  
  modal.style.display = 'block';
  modal.dataset.currentCard = cardType;
}

function closeQuizModal() {
  const modal = document.getElementById('quizModal');
  modal.style.display = 'none';
}

// ================= Back to Top Button =================
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ================= Initialize Quiz & Modal =================
function initQuizModal() {
  setTimeout(() => {
    const quizBtns = document.querySelectorAll('.quiz-btn');
    const modal = document.getElementById('quizModal');
    const closeBtn = document.querySelector('.close-modal');
    const submitBtn = document.getElementById('submitAnswerBtn');
    
    quizBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardType = btn.getAttribute('data-card');
        openQuizModal(cardType);
      });
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeQuizModal);
    }
    
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (selectedAnswer === null) {
          alert('Please select an answer!');
          return;
        }
        
        const cardType = modal.dataset.currentCard;
        const quiz = quizData[cardType];
        
        if (selectedAnswer === quiz.correct) {
          alert('🎉 Correct! Great job!');
        } else {
          alert(`❌ Not quite. The correct answer is: ${quiz.options[quiz.correct]}`);
        }
        closeQuizModal();
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeQuizModal();
        }
      });
    }
    
    initBackToTop();
    console.log('✓ Quiz modal and back-to-top initialized');
  }, 200);
}
