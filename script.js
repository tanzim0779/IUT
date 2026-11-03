/* =========================================================
   STUDYSPACE — HSC chapter library + personal notes
   STATIC NOTES: add chapter content inside staticNotes below.
   PERSONAL NOTES: saved in IndexedDB in this browser/device.
   Backup: use Export Backup / Import Backup in My Notes.
========================================================= */
"use strict";

const data = {
  physics: {
    title: "Physics",
    desc: "Explore the laws that shape our physical world.",
    papers: [
      ["Physical World and Measurement","Vector","Dynamics","Newtonian Mechanics","Work, Energy and Power","Gravitation and Gravity","Structural Properties of Matter","Periodic Motion","Waves","Ideal Gas and Kinetic Theory"],
      ["Thermodynamics","Static Electricity","Current Electricity","Magnetic Effects of Electric Current and Magnetism","Electromagnetic Induction and Alternating Current","Geometrical Optics","Physical Optics","Introduction to Modern Physics","Atomic Model and Nuclear Physics","Semiconductor and Electronics","Astronomy"]
    ]
  },
  chemistry: {
    title: "Chemistry",
    desc: "Understand matter, reactions and everyday chemistry.",
    papers: [
      ["Safe Use of the Laboratory","Qualitative Chemistry","Periodic Properties and Chemical Bonding","Chemical Changes","Vocational Chemistry"],
      ["Environmental Chemistry","Organic Chemistry","Quantitative Chemistry","Electrochemistry","Economic Chemistry"]
    ]
  },
  math: {
    title: "Mathematics",
    desc: "Build mathematical thinking through concepts and problem solving.",
    papers: [
      ["Matrices and Determinants","Vectors","Straight Lines","Circle","Permutations and Combinations","Trigonometric Ratios","Associated Angles","Functions and Graphs","Differentiation","Integration"],
      ["Real Numbers and Inequalities","Linear Programming","Complex Numbers","Polynomials and Polynomial Equations","Binomial Expansion","Conics","Inverse Trigonometric Functions","Statics","Dynamics","Probability"]
    ]
  },
  english: {
    title: "English",
    desc: "Strengthen your language skills.",
    options: ["Grammar","Vocabulary"]
  }
};

/* STATIC NOTES EXAMPLE
   Key format: subject-paperIndex-chapterIndex
   Example: physics-0-1 = Physics, First Paper, Chapter 2.
   Add more entries here; HTML is authored by you, not visitor input.
*/
const staticNotes = {
  "physics-0-1": {
    intro: "A vector is a physical quantity that has both magnitude and direction.",
    html: "<h3>Core idea</h3><p>Examples include displacement, velocity, acceleration and force. A scalar has magnitude only, such as mass, time and temperature.</p><h3>Key properties</h3><ul><li>Vectors are represented by directed line segments.</li><li>The length represents magnitude; the arrow indicates direction.</li><li>Equal vectors have the same magnitude and direction.</li></ul><h3>Remember</h3><p>Resolve vectors along suitable perpendicular axes before combining components.</p>"
  }
};

const home = document.getElementById("home-page");
const dynamic = document.getElementById("dynamic-page");
const content = document.getElementById("page-content");
let route = { type: "home" };
let stack = [];
let dbPromise;
let autosaveTimer;

const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

function go(nextRoute) {
  stack.push(route);
  route = nextRoute;
  home.classList.remove("active");
  dynamic.classList.add("active");
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function back() {
  clearTimeout(autosaveTimer);
  route = stack.pop() || { type: "home" };
  if (route.type === "home") {
    dynamic.classList.remove("active");
    home.classList.add("active");
  } else {
    render();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function head(title, description) {
  return '<div class="dynamic-heading"><p class="eyebrow">YOUR PERSONAL STUDY LIBRARY</p><h1>' +
    esc(title) + '</h1><p class="dynamic-description">' + esc(description) + '</p></div>';
}

function render() {
  const r = route;

  if (r.type === "subject") {
    const subject = data[r.subject];
    const options = subject.papers || subject.options;
    content.innerHTML = head(subject.title, subject.desc) +
      '<div class="selection-grid">' + options.map((item, index) =>
        '<button class="selection-card" data-a="' + (subject.papers ? "paper" : "english") +
        '" data-i="' + index + '" data-option="' + esc(item) + '">' +
        '<span class="selection-number">0' + (index + 1) + '</span>' +
        '<span class="selection-icon">◈</span>' +
        '<span class="selection-title">' + esc(subject.papers ? (index ? "Second" : "First") + " Paper" : item) + '</span>' +
        '<span class="selection-description">' + (subject.papers ? item.length + " chapters" : "Explore " + esc(item) + " materials") + '</span>' +
        '<span class="card-arrow">↗</span></button>'
      ).join("") + '</div>';
  }

  if (r.type === "paper") {
    const subject = data[r.subject];
    const chapters = subject.papers[r.paper];
    content.innerHTML = head(subject.title + " — " + (r.paper ? "Second" : "First") + " Paper",
      "Select a chapter to explore its notes.") +
      '<div class="chapter-list">' + chapters.map((chapter, index) =>
        '<button class="chapter-row" data-a="chapter" data-i="' + index + '">' +
        '<span class="chapter-count">' + String(index + 1).padStart(2, "0") + '</span>' +
        '<span class="chapter-label">' + esc(chapter) + '</span>' +
        '<span class="chapter-meta">Open ↗</span></button>'
      ).join("") + '</div>';
  }

  if (r.type === "chapter") {
    const subject = data[r.subject];
    const title = subject.papers[r.paper][r.index];
    const note = staticNotes[r.subject + "-" + r.paper + "-" + r.index];
    content.innerHTML = head(title, subject.title + " · " + (r.paper ? "Second" : "First") + " Paper") +
      '<article class="note-content-card"><div class="note-card-top">' +
      '<span class="note-tag">STATIC STUDY NOTES</span><span class="note-tag subtle-tag">CURATED CONTENT</span></div>' +
      '<h2>' + esc(title) + '</h2><p class="muted">' +
      (note ? esc(note.intro) : "Static notes for this chapter can be added in the staticNotes object in script.js.") +
      '</p>' + (note ? '<div class="static-note-body">' + note.html + '</div>' :
        '<div class="empty-chapter-state"><h2>Notes coming soon</h2><p>Add definitions, explanations, formulas and worked examples to this chapter.</p></div>') +
      '<button class="primary-button" data-a="new" data-sub="' + esc(r.subject) +
      '" data-ch="' + esc(title) + '">＋ Write a personal note</button></article>';
  }

  if (r.type === "english") {
    content.innerHTML = head("English — " + r.option, "Explore your language learning materials.") +
      '<div class="empty-chapter-state"><h2>' + esc(r.option) + ' Library</h2>' +
      '<p>Your lessons and practice materials will appear here.</p>' +
      '<button class="primary-button" data-a="new" data-sub="english" data-ch="' + esc(r.option) +
      '">＋ Create a study note</button></div>';
  }

  if (r.type === "notes") listNotes();
  if (r.type === "editor") editor(r.id || null, r.ctx || {});
}

/* IndexedDB keeps notes structured and supports larger rich-text notes than localStorage. */
function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("This browser does not support local note storage."));
        return;
      }
      const request = indexedDB.open("StudySpaceDB", 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("notes")) {
          request.result.createObjectStore("notes", { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

async function notes() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction("notes", "readonly").objectStore("notes").getAll();
    request.onsuccess = () => resolve(request.result.sort((a, b) => b.updated - a.updated));
    request.onerror = () => reject(request.error);
  });
}

async function put(note) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction("notes", "readwrite").objectStore("notes").put(note);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
}

async function del(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction("notes", "readwrite").objectStore("notes").delete(id);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
}

/* Allow only safe formatting tags in personal rich-text notes. */
function clean(html) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const allowed = ["P","BR","B","STRONG","I","EM","U","H2","H3","H4","UL","OL","LI","BLOCKQUOTE","PRE","CODE","HR","SUB","SUP"];
  function walk(node) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 8) child.remove();
      else if (child.nodeType === 1) {
        if (!allowed.includes(child.tagName)) {
          child.replaceWith(...child.childNodes);
          return;
        }
        [...child.attributes].forEach(attribute => child.removeAttribute(attribute.name));
        walk(child);
      }
    });
  }
  walk(parsed.body);
  return parsed.body.innerHTML;
}

function editor(id, context) {
  content.innerHTML = head(id ? "Edit Personal Note" : "Create Personal Note",
    "Your personal notes are saved in this browser on this device.") +
    '<div class="editor-card">' +
    '<label class="field-label">Note title<input id="ntitle" class="field-input" maxlength="120" placeholder="e.g. Newton’s Laws — Quick Revision"></label>' +
    '<div class="editor-meta">' +
    '<label class="field-label">Subject<select id="nsubject" class="field-input">' +
    '<option value="">General</option><option value="physics">Physics</option><option value="chemistry">Chemistry</option><option value="math">Mathematics</option><option value="english">English</option></select></label>' +
    '<label class="field-label">Chapter<input id="nchapter" class="field-input" maxlength="120" placeholder="Chapter name"></label></div>' +
    '<div class="editor-toolbar"><button type="button" data-f="bold"><b>B</b></button>' +
    '<button type="button" data-f="italic"><i>I</i></button><button type="button" data-f="underline"><u>U</u></button>' +
    '<button type="button" data-f="formatBlock" data-v="H2">Heading</button>' +
    '<button type="button" data-f="insertUnorderedList">• List</button>' +
    '<button type="button" data-f="insertOrderedList">1. List</button></div>' +
    '<div id="nbody" class="rich-editor" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="Write your ideas, definitions, formulas and revision points..."></div>' +
    '<div class="editor-footer"><span class="muted" id="save-status">Ready to write</span>' +
    '<div><button class="secondary-button" data-a="cancel">Cancel</button> <button class="primary-button" data-a="save">Save Note</button></div></div></div>';

  document.getElementById("nsubject").value = context.subject || "";
  document.getElementById("nchapter").value = context.chapter || "";
  content.dataset.id = id || "";

  if (id) {
    notes().then(allNotes => {
      const note = allNotes.find(item => item.id === id);
      if (!note || route.type !== "editor" || route.id !== id) return;
      document.getElementById("ntitle").value = note.title;
      document.getElementById("nsubject").value = note.subject || "";
      document.getElementById("nchapter").value = note.chapter || "";
      document.getElementById("nbody").innerHTML = clean(note.html || "");
    }).catch(showStorageError);
  }
}

async function listNotes(query = "") {
  try {
    const allNotes = await notes();
    const filtered = allNotes.filter(note =>
      (note.title + " " + note.chapter + " " + note.subject).toLowerCase().includes(query.toLowerCase())
    );
    content.innerHTML = head("My Notes", "Your personal notes, stored locally in this browser.") +
      '<div class="notes-toolbar"><input id="lib-search" class="search-input" type="search" placeholder="Search notes..." value="' + esc(query) + '">' +
      '<button class="primary-button" data-a="new">＋ New Note</button>' +
      '<button class="secondary-button" data-a="export">Export Backup</button>' +
      '<button class="secondary-button" data-a="import">Import Backup</button>' +
      '<input id="backup-file" type="file" accept="application/json" hidden></div>' +
      (filtered.length ? '<div class="notes-grid">' + filtered.map(note =>
        '<article class="personal-note-card"><div class="note-card-top"><span class="note-tag">' +
        esc(note.subject || "General") + '</span><button class="icon-button" data-a="fav" data-id="' +
        esc(note.id) + '" aria-label="Toggle favorite">' + (note.fav ? "★" : "☆") + '</button></div>' +
        '<h3>' + esc(note.title) + '</h3><p class="muted">' + esc(note.chapter || "No chapter") +
        '</p><p class="note-preview">' + esc((note.text || "").slice(0, 120)) + '</p>' +
        '<div class="note-actions"><button class="text-button" data-a="edit" data-id="' + esc(note.id) +
        '">Edit</button><button class="text-button danger" data-a="delete" data-id="' + esc(note.id) +
        '">Delete</button><span class="muted">' + new Date(note.updated).toLocaleDateString() +
        '</span></div></article>'
      ).join("") + '</div>' :
        '<div class="empty-chapter-state"><h2>No notes found</h2><p>Create your first personal note.</p><button class="primary-button" data-a="new">＋ Create Note</button></div>');
    document.getElementById("lib-search").addEventListener("input", event => listNotes(event.target.value));
  } catch (error) {
    content.innerHTML = head("My Notes", "Personal note storage is not available.") +
      '<div class="empty-chapter-state"><p>' + esc(error.message) + '</p></div>';
  }
}

async function recent(query = "") {
  const element = document.getElementById("recent-notes");
  if (!element) return;
  const allNotes = (await notes()).filter(note =>
    (note.title + " " + note.chapter + " " + note.subject).toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);
  element.innerHTML = allNotes.length ? allNotes.map(note =>
    '<button class="recent-note" data-open="' + esc(note.id) + '"><span><b>' +
    esc(note.title) + '</b><small>' + esc(note.subject || "General") + ' · ' +
    esc(note.chapter || "") + '</small></span><span>↗</span></button>'
  ).join("") : '<p class="muted">No personal notes yet. Create one to get started.</p>';
}

function showStorageError(error) {
  const status = document.getElementById("save-status");
  if (status) status.textContent = "Storage error: " + error.message;
  console.error(error);
}

/* Main navigation */
document.querySelectorAll(".subject-card").forEach(button => {
  button.addEventListener("click", () => go({ type: "subject", subject: button.dataset.page }));
});
document.getElementById("back-button").addEventListener("click", back);
document.getElementById("brand-home").addEventListener("click", event => {
  event.preventDefault();
  clearTimeout(autosaveTimer);
  stack = [];
  route = { type: "home" };
  dynamic.classList.remove("active");
  home.classList.add("active");
});
document.getElementById("open-my-notes").onclick = () => go({ type: "editor" });
document.getElementById("view-all-notes").onclick = () => go({ type: "notes" });
document.getElementById("note-search-home").oninput = event => recent(event.target.value);
document.getElementById("recent-notes").addEventListener("click", event => {
  const button = event.target.closest("[data-open]");
  if (button) go({ type: "editor", id: button.dataset.open });
});

/* Actions inside dynamic pages */
content.addEventListener("click", async event => {
  const formatButton = event.target.closest("[data-f]");
  if (formatButton) {
    document.execCommand(formatButton.dataset.f, false, formatButton.dataset.v || null);
    document.getElementById("nbody")?.focus();
    return;
  }

  const button = event.target.closest("[data-a]");
  if (!button) return;
  const action = button.dataset.a;

  if (action === "paper") go({ type: "paper", subject: route.subject, paper: Number(button.dataset.i) });
  if (action === "english") go({ type: "english", option: button.dataset.option });
  if (action === "chapter") go({ type: "chapter", subject: route.subject, paper: route.paper, index: Number(button.dataset.i) });
  if (action === "new") go({ type: "editor", ctx: { subject: button.dataset.sub || "", chapter: button.dataset.ch || "" } });
  if (action === "cancel") back();

  if (action === "save") {
    clearTimeout(autosaveTimer);
    const title = document.getElementById("ntitle").value.trim();
    if (!title) { alert("Please enter a note title."); return; }
    try {
      const html = clean(document.getElementById("nbody").innerHTML);
      const id = content.dataset.id || "note-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
      const old = (await notes()).find(note => note.id === id);
      const plainText = new DOMParser().parseFromString(html, "text/html").body.textContent || "";
      await put({
        id, title, subject: document.getElementById("nsubject").value,
        chapter: document.getElementById("nchapter").value.trim(), html, text: plainText,
        fav: old?.fav || false, created: old?.created || Date.now(), updated: Date.now()
      });
      back();
      recent();
    } catch (error) { showStorageError(error); }
  }

  if (action === "edit") go({ type: "editor", id: button.dataset.id });
  if (action === "delete" && confirm("Delete this note from this browser?")) {
    await del(button.dataset.id);
    listNotes(document.getElementById("lib-search")?.value || "");
    recent();
  }
  if (action === "fav") {
    const note = (await notes()).find(item => item.id === button.dataset.id);
    if (note) {
      note.fav = !note.fav;
      await put(note);
      listNotes(document.getElementById("lib-search")?.value || "");
    }
  }
  if (action === "export") {
    const backup = { app: "StudySpace", version: 1, notes: await notes() };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "studyspace-notes-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  if (action === "import") document.getElementById("backup-file").click();
});

content.addEventListener("change", async event => {
  if (event.target.id === "backup-file" && event.target.files[0]) {
    try {
      const backup = JSON.parse(await event.target.files[0].text());
      if (!Array.isArray(backup.notes)) throw new Error("Invalid backup structure");
      for (const note of backup.notes) {
        if (note.id && note.title) await put({ ...note, html: clean(note.html || "") });
      }
      await listNotes();
      await recent();
      alert("Backup imported successfully.");
    } catch {
      alert("Invalid backup file. Please choose a StudySpace JSON backup.");
    }
  }
});

async function autosaveDraft() {
  const titleElement = document.getElementById("ntitle");
  const bodyElement = document.getElementById("nbody");
  if (!titleElement || !bodyElement || route.type !== "editor") return;
  const title = titleElement.value.trim();
  if (!title) return;
  const html = clean(bodyElement.innerHTML);
  const id = content.dataset.id || "note-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
  const old = (await notes()).find(note => note.id === id);
  const plainText = new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  await put({
    id, title, subject: document.getElementById("nsubject")?.value || "",
    chapter: document.getElementById("nchapter")?.value.trim() || "",
    html, text: plainText, fav: old?.fav || false,
    created: old?.created || Date.now(), updated: Date.now()
  });
  content.dataset.id = id;
  const status = document.getElementById("save-status");
  if (status) status.textContent = "Auto-saved on this device";
}

content.addEventListener("input", event => {
  if (!["nbody", "ntitle", "nchapter"].includes(event.target.id)) return;
  const status = document.getElementById("save-status");
  if (status) status.textContent = "Saving draft…";
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => autosaveDraft().catch(showStorageError), 800);
});
content.addEventListener("change", event => {
  if (event.target.id === "nsubject") {
    clearTimeout(autosaveTimer);
    autosaveDraft().catch(showStorageError);
  }
});

recent().catch(error => {
  const element = document.getElementById("recent-notes");
  if (element) element.innerHTML = '<p class="muted">Local note storage is unavailable in this browser.</p>';
  console.error(error);
});

console.log("StudySpace workspace ready.");
