/* Load sections */
function loadSection(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => document.getElementById(id).innerHTML = data);
}

loadSection("home", "sections/home.html");
loadSection("whatido", "sections/whatido.html");
loadSection("reflection", "sections/reflection.html");
loadSection("notes", "sections/notes.html");

/* Typed animation */
document.addEventListener("DOMContentLoaded", () => {
  new Typed('#typed', {
    strings: ["Engineer", "Table Tennis Coach", "Problem Solver", "Lifelong Learner"],
    typeSpeed: 80,
    backSpeed: 50,
    loop: true
  });
});

/* Profile photo slider */
setInterval(() => {
  const img = document.getElementById("profilePhoto");
  if (!img) return;
  img.src = img.src.includes("profile.jpg")
    ? "images/profile_cartoon.jpg"
    : "images/profile.jpg";
}, 3000);

/* Accordion */
document.addEventListener("click", e => {
  if (e.target.classList.contains("accordion-header")) {
    const content = e.target.nextElementSibling;
    content.style.display =
      content.style.display === "block" ? "none" : "block";
  }
});
