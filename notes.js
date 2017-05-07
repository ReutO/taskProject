var count = 0;
var notes = {};
var maxIdFromLS = 0;

function noRefresh(e) { //for not refreshing the page on submit
    e.preventDefault();
}

function getNotes() { //onload - get from local storage
    var localNotesStr = localStorage.getItem("notes");
    var arr = []; //helps to find the max id to begin the count of the id
    if (localNotesStr == null || localNotesStr == "{}") {
        return
    }
    var localNotesObj = JSON.parse(localNotesStr); //making an object from the LS and receving it's values
    for (var prop in localNotesObj) {
        var dateValue = localNotesObj[prop].date;
        var noteValue = localNotesObj[prop].note;
        var idSavedNotesImage = localNotesObj[prop].ID;
        var numID = parseInt(idSavedNotesImage);
        arr.push(numID);

        makeNote(dateValue, noteValue, idSavedNotesImage); //making notes from the local storage
    }
    this
    maxIdFromLS = Math.max.apply(Math, arr); // method calls a function with a given this value and arguments provided as an array
}

function saveNote() { //creating a new task
    var insertNote = document.getElementById("insertNote");
    var noteValue = insertNote.value;
    var insertDate = document.getElementById("insertDate");
    var dateValue = insertDate.value;
    var Palert = document.getElementById("Palert");
    var re = /^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$/; //validating
    var testRe = re.test(dateValue);
    if (noteValue == "" || testRe == false) {
        Palert.innerHTML = "כדי לשמור חשוב לכתוב משימה ולהכניס תאריך לביצוע בפורמט נכון"
        return false;
    } else {
        Palert.innerHTML = "";
        var idSavedNotesImage = "";
        var getID = makeNote(dateValue, noteValue, idSavedNotesImage); //creating the note in DOM
        saveLocalStorage(dateValue, noteValue, getID); //saving the new tasks with their new ids to local storage

    }
    insertNote.value = "";
    insertDate.value = "";
}

function makeNote(dateValue, noteValue, idSavedNotesImage) {
    var savedNotesImages = document.getElementById("savedNotesImages"); 
    var savedNotesImage = document.createElement("div"); 
    savedNotesImage.className = "savedNotesImage";
    if (idSavedNotesImage == "") {
        var idSavedNotesImage = addId(savedNotesImage); //to make a key for every note in the local storage
    }
    savedNotesImages.appendChild(savedNotesImage);
    var noteText = document.createElement("p");
    noteText.className = "noteText";
    noteText.innerHTML = noteValue;
    savedNotesImage.appendChild(noteText);
    var noteDate = document.createElement("p");
    noteDate.className = "noteDate";
    noteDate.innerHTML = dateValue;
    savedNotesImage.appendChild(noteDate);
    var closeNote = document.createElement("div"); //adding detete option on the notes
    closeNote.className = "closeNote";
    closeNote.style.display = "none";
    savedNotesImage.addEventListener("mouseenter", function () {
        closeNote.style.display = "block";
    });
    savedNotesImage.addEventListener("mouseleave", function () {
        closeNote.style.display = "none";
    });
    closeNote.addEventListener("click", function () {
        var remove = this.parentNode.parentNode;
        deleteFromLocalStorage(remove, idSavedNotesImage); //deleting from local storage using the id
        this.parentNode.parentNode.removeChild(this.parentNode); 
    });

    savedNotesImage.appendChild(closeNote);
    return idSavedNotesImage;

}

function deleteFromLocalStorage(remove, idSavedNotesImage) {
    var localNotesStr = localStorage.getItem("notes");
    var localNotesObj = JSON.parse(localNotesStr);
    delete localNotesObj[idSavedNotesImage]; 
    var newNoteString = JSON.stringify(localNotesObj);
    localStorage.setItem("notes", newNoteString);

}


function addId(savedNotesImage) {
    if (maxIdFromLS > count) {//when the page doesn't onload
        count = maxIdFromLS;
    }
    count++;

    savedNotesImage.id = count;
    return savedNotesImage.id;
}



function saveLocalStorage(dateValue, noteValue, idSavedNotesImage) { //creating an object and adding it to LS
    var localNotesStr = localStorage.getItem("notes");
    if (localNotesStr) {//if there are no notes in the LS
        notes = JSON.parse(localNotesStr);
    }
    notes[idSavedNotesImage] = {
        note: noteValue,
        date: dateValue,
        ID: idSavedNotesImage

    }
    var noteString = JSON.stringify(notes);
    localStorage.setItem("notes", noteString);

}


