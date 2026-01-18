// ================= Load Sections Dynamically =================
const sections = ['home', 'whatido', 'reflection', 'notes'];
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
        if(section==='reflection') setTimeout(() => initAccordion(), 100);
        
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
  // Typed.js animation
  const typedElement = document.getElementById('typed');
  if (!typedElement) {
    console.error('ERROR: #typed element not found!');
    return;
  }

  // Check if Typed library is loaded
  if (typeof Typed === 'undefined') {
    console.error('ERROR: Typed.js library not loaded!');
    return;
  }

  new Typed('#typed', {
    strings: ["Engineer", "Table Tennis Coach", "Problem Solver", "Lifelong Learner"],
    typeSpeed: 80,
    backSpeed: 50,
    loop: true
  });

  // Profile photo slider
  const profilePhoto = document.getElementById('profilePhoto');
  if (!profilePhoto) {
    console.error('ERROR: #profilePhoto element not found!');
    return;
  }

  const photos = ['images/profile.jpg', 'images/profile_cartoon.jpg'];
  let currentIndex = 0;
  setInterval(()=>{
    currentIndex = (currentIndex + 1) % photos.length;
    profilePhoto.src = photos[currentIndex];
  }, 3000);

  console.log('✓ Home animations initialized successfully');
}

// ================= Accordion for Reflection =================
function initAccordion(){
  const accItems = document.querySelectorAll('.accordion-item');
  accItems.forEach(item => {
    item.querySelector('.accordion-header').addEventListener('click', ()=>{
      const content = item.querySelector('.accordion-content');
      const allContents = document.querySelectorAll('.accordion-content');
      allContents.forEach(c => { if(c!==content) c.style.display='none'; });
      content.style.display = content.style.display==='block'?'none':'block';
    });
  });
}
