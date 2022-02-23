const books = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
    return {
        id, 
        title, 
        author,
        year,
        isCompleted
    }
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId) {
            return book
        }
    }
    return null
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }
    return -1
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));

    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBookShelf(bookObject) {

    const { id, title, author, year, isCompleted } = bookObject;

    const textTitle = document.createElement("h2");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Author : " + author;

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun : " + year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);
    container.setAttribute("id", `book-${id}`);

    if (isCompleted) {
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            undoBookFromCompleted(id);
        });
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            confirmDelete(id);
        });
        container.append(undoButton, trashButton);
    } else {

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            confirmDelete(id);
        });
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            addBookToCompleted(id);
        });
        container.append(checkButton, trashButton);
    }

    return container;
}

function addBook() {
    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const textYear = document.getElementById("inputBookYear").value;
    const completeBook = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateTodoObject(generatedID, textTitle, textAuthor, textYear, completeBook);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function confirmDelete(bookId){
    let confirmdelete = window.confirm('Apakah Kamu ingin Menghapus Buku ini?');
    if (confirmdelete == true) {
        removeBookFromCompleted(bookId);
    }
}

function undoBookFromCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookShelfList = document.getElementById("incompleteBookshelfList");
    const listCompleted = document.getElementById("completeBookshelfList");

    incompleteBookShelfList.innerHTML = ""
    listCompleted.innerHTML = ""

    for (book of books) {
        const todoElement = makeBookShelf(book);
        if (book.isCompleted) {
            listCompleted.append(todoElement);
        } else {
            incompleteBookShelfList.append(todoElement);
        }
    }
})
