/* =========================================
   STUDYSPACE
   PREMIUM ACADEMIC DASHBOARD
   Main Navigation System
========================================= */


/* 01. SUBJECT DATABASE */

const subjects = {

    physics: {
        title: "Physics",
        description: "Explore the world of physical science.",
        papers: ["First Paper", "Second Paper"]
    },

    chemistry: {
        title: "Chemistry",
        description: "Discover the science of matter.",
        papers: ["First Paper", "Second Paper"]
    },

    math: {
        title: "Mathematics",
        description: "Think logically. Solve beautifully.",
        papers: ["First Paper", "Second Paper"]
    },

    english: {
        title: "English",
        description: "Build your language skills.",
        options: ["Grammar", "Vocabulary"]
    }

};


/* 02. PAGE ELEMENTS */

const homePage = document.getElementById("home-page");

const dynamicPage = document.getElementById("dynamic-page");

const pageContent = document.getElementById("page-content");

const backButton = document.getElementById("back-button");


/* 03. NAVIGATION HISTORY */

let navigationHistory = [];


/* 04. SHOW PAGE */

function showPage() {

    homePage.classList.remove("active");

    dynamicPage.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* 05. GO TO HOME */

function goHome() {

    homePage.classList.add("active");

    dynamicPage.classList.remove("active");

    navigationHistory = [];

    pageContent.innerHTML = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* 06. CREATE PAGE HEADER */

function createPageHeader(title, description) {

    return `
        <div class="dynamic-heading">

            <p class="eyebrow">
                YOUR PERSONAL STUDY LIBRARY
            </p>

            <h1>${title}</h1>

            <p class="dynamic-description">
                ${description}
            </p>

        </div>
    `;

}


/* 07. SUBJECT PAGE */

function openSubject(subjectKey) {

    const subject = subjects[subjectKey];

    if (!subject) return;

    navigationHistory.push("home");

    showPage();

    let content = createPageHeader(
        subject.title,
        subject.description
    );


    if (subject.papers) {

        content += `
            <div class="selection-grid">

                ${subject.papers.map((paper, index) => `

                    <button
                        class="selection-card"
                        data-paper="${index}"
                        data-subject="${subjectKey}">

                        <span class="selection-number">
                            0${index + 1}
                        </span>

                        <span class="selection-icon">
                            ◈
                        </span>

                        <span class="selection-title">
                            ${paper}
                        </span>

                        <span class="selection-description">
                            Explore chapters and notes
                        </span>

                        <span class="card-arrow">↗</span>

                    </button>

                `).join("")}

            </div>
        `;

    } else {

        content += `
            <div class="selection-grid">

                ${subject.options.map((option, index) => `

                    <button
                        class="selection-card"
                        data-option="${option}"
                        data-subject="${subjectKey}">

                        <span class="selection-number">
                            0${index + 1}
                        </span>

                        <span class="selection-icon">
                            ${index === 0 ? "Aa" : "✧"}
                        </span>

                        <span class="selection-title">
                            ${option}
                        </span>

                        <span class="selection-description">
                            Explore ${option.toLowerCase()} notes
                        </span>

                        <span class="card-arrow">↗</span>

                    </button>

                `).join("")}

            </div>
        `;

    }

    pageContent.innerHTML = content;

}


/* 08. PAPER PAGE */

function openPaper(subjectKey, paperIndex) {

    const subject = subjects[subjectKey];

    if (!subject || !subject.papers) return;

    const paperName = subject.papers[paperIndex];

    if (!paperName) return;

    navigationHistory.push("subject");

    let content = createPageHeader(
        `${subject.title} — ${paperName}`,
        "Choose a chapter to explore your study materials."
    );

    content += `
        <div class="empty-chapter-state">

            <div class="empty-icon">✦</div>

            <h2>Chapter Library</h2>

            <p>
                Your chapter list will appear here
                in the next development step.
            </p>

        </div>
    `;

    pageContent.innerHTML = content;

    showPage();

}


/* 09. ENGLISH OPTION PAGE */

function openEnglishOption(option) {

    navigationHistory.push("subject");

    let content = createPageHeader(
        `English — ${option}`,
        `Explore your ${option.toLowerCase()} learning materials.`
    );

    content += `
        <div class="empty-chapter-state">

            <div class="empty-icon">✦</div>

            <h2>${option} Library</h2>

            <p>
                Your ${option.toLowerCase()} materials
                will be added here.
            </p>

        </div>
    `;

    pageContent.innerHTML = content;

    showPage();

}


/* 10. SUBJECT BUTTON EVENTS */

document.querySelectorAll(".subject-card").forEach(button => {

    button.addEventListener("click", () => {

        const subjectKey = button.dataset.page;

        openSubject(subjectKey);

    });

});


/* 11. DYNAMIC BUTTON EVENTS */

pageContent.addEventListener("click", event => {

    const paperButton = event.target.closest("[data-paper]");

    const optionButton = event.target.closest("[data-option]");


    if (paperButton) {

        const subjectKey = paperButton.dataset.subject;

        const paperIndex = Number(paperButton.dataset.paper);

        openPaper(subjectKey, paperIndex);

        return;

    }


    if (optionButton) {

        const option = optionButton.dataset.option;

        openEnglishOption(option);

    }

});


/* 12. BACK BUTTON */

backButton.addEventListener("click", () => {

    const previousPage = navigationHistory.pop();

    if (previousPage === "subject") {

        // Return to the subject selection page.
        // The previous subject is stored for restoration.
        const previousSubject = window.currentSubject;

        if (previousSubject) {

            navigationHistory.push("home");

            openSubject(previousSubject);

            window.currentSubject = previousSubject;

        } else {

            goHome();

        }

    } else {

        goHome();

    }

});


/* 13. SAVE CURRENT SUBJECT */

const originalOpenSubject = openSubject;

window.currentSubject = null;

document.querySelectorAll(".subject-card").forEach(button => {

    button.addEventListener("click", () => {

        window.currentSubject = button.dataset.page;

    });

});


/* 14. INITIALIZATION */

console.log("StudySpace initialized successfully.");

console.log("Welcome to your personal study library!");

