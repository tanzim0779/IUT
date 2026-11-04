/* =========================================
   IUT MATHEMATICS PORTAL
   JAVASCRIPT FUNCTIONALITY

   Main Features:
   1. Mathematics Set Selection
   2. Full Page Coming Soon Screen
   3. Back Navigation
   4. Browser History Support

   Future additions:
   - Individual Topic Pages
   - PDF Resources
   - Video Lectures
   - Online Quizzes
   - Search System
========================================= */


/* =========================================
   01. SELECT HTML ELEMENTS
========================================= */

const setCards = document.querySelectorAll(".set-card");

const mathematicsSection =
    document.querySelector(".mathematics-section");

const comingSoonSection =
    document.querySelector(".coming-soon-section");

const selectedSetName =
    document.getElementById("selected-set-name");

const backButton =
    document.getElementById("back-to-sets");


/* =========================================
   02. SET INFORMATION

   Future:
   Add individual descriptions,
   resources and topic information here.
========================================= */

const mathematicsSets = {

    1: "Set 01 — Functions and Calculus",

    2: "Set 02 — Trigonometry",

    3: "Set 03 — Coordinate Geometry",

    4: "Set 04 — Algebra and Number Systems",

    5: "Set 05 — Counting, Statistics and Probability",

    6: "Set 06 — Vectors and Mechanics"

};


/* =========================================
   03. OPEN SELECTED MATHEMATICS SET
========================================= */

function openMathematicsSet(setNumber) {

    const setTitle = mathematicsSets[setNumber];

    // Check whether the selected set exists

    if (!setTitle) {

        console.error("Invalid Mathematics Set!");

        return;

    }


    // Display selected set title

    selectedSetName.textContent = setTitle;


    // Hide Mathematics Collection

    mathematicsSection.hidden = true;


    // Show Coming Soon Page

    comingSoonSection.hidden = false;


    // Scroll to the top

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    // Update browser history

    history.pushState(

        { selectedSet: setNumber },

        "",

        "#set-" + setNumber

    );

}


/* =========================================
   04. ADD CLICK EVENT TO ALL SIX CARDS
========================================= */

setCards.forEach(function(card) {

    card.addEventListener("click", function() {

        const setNumber = this.dataset.set;

        openMathematicsSet(setNumber);

    });

});


/* =========================================
   05. BACK TO MATHEMATICS SETS
========================================= */

function returnToMathematics() {

    comingSoonSection.hidden = true;

    mathematicsSection.hidden = false;


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================
   06. BACK BUTTON EVENT
========================================= */

backButton.addEventListener("click", function() {

    if (location.hash.startsWith("#set-")) {

        history.back();

    } else {

        returnToMathematics();

    }

});


/* =========================================
   07. BROWSER BACK BUTTON SUPPORT
========================================= */

window.addEventListener("popstate", function(event) {

    const setNumber = event.state?.selectedSet;

    if (setNumber && mathematicsSets[setNumber]) {

        selectedSetName.textContent =
            mathematicsSets[setNumber];

        mathematicsSection.hidden = true;

        comingSoonSection.hidden = false;

    } else {

        returnToMathematics();

    }

});


/* =========================================
   08. INITIAL PAGE STATE

   Future:
   Restore selected topic from URL
   and support direct page navigation.
========================================= */

function initializePortal() {

    const match = location.hash.match(/^#set-(\d+)$/);

    if (match && mathematicsSets[match[1]]) {

        selectedSetName.textContent =
            mathematicsSets[match[1]];

        mathematicsSection.hidden = true;

        comingSoonSection.hidden = false;

    } else {

        mathematicsSection.hidden = false;

        comingSoonSection.hidden = true;

    }

}


/* =========================================
   09. START APPLICATION
========================================= */

initializePortal();


console.log(
    "IUT Mathematics Portal Initialized Successfully!"
);
