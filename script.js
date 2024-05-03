// Definiert eine Klasse TodoManager, die die Verwaltung der To-Do-Liste übernimmt
class TodoManager {
  constructor() {
    // Initialisiert Variablen für verschiedene DOM-Elemente
    this.submitButton = document.getElementById('submit');
    this.todoInput = document.getElementById('todoInput');
    this.todoList = document.getElementById('todoList');
    this.doneList = document.getElementById('doneList');
    this.charCounter = document.querySelector('.char-counter');

    // Event-Listener für das Hinzufügen von To-Dos, das Aktualisieren des Charakterzählers und das Abfangen der Enter-Taste hinzufügen
    this.submitButton.addEventListener('click', this.addTodo.bind(this));
    this.todoInput.addEventListener('input', this.updateCharCounter.bind(this));
    this.todoInput.addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  // Methode zum Hinzufügen eines neuen To-Dos
  addTodo() {
    const todoInput = this.todoInput;
    if (todoInput.value.trim() !== '' && todoInput.value.trim().length <= 22) {
      // Erstellt ein neues To-Do-Element und fügt es der Liste hinzu
      const newTask = document.createElement('div');
      const newButton = document.createElement('button');
      newButton.textContent = todoInput.value;
      newButton.type = 'button';
      newButton.classList.add('todo-item');
      newButton.addEventListener('click', this.markAsDone.bind(this));
      newTask.appendChild(newButton);
      this.todoList.appendChild(newTask);

      // Lokale Speicherung aktualisieren und Eingabefeld leeren
      this.setLocalStorage();
      todoInput.value = '';
      this.updateCharCounter();
    } else {
      console.log('no input')
    }
  }

  // Methode zum Markieren eines To-Dos als erledigt oder wieder rückgängig machen
  markAsDone(event) {
    const task = event.target.parentNode;
    if (!event.target.classList.contains('done')) {
      // To-Do als erledigt markieren und zur erledigten Liste verschieben
      event.target.classList.add('done');
      this.doneList.appendChild(task);

      // Löschen-Button hinzufügen und lokale Speicherung aktualisieren
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.type = 'button';
      deleteButton.classList.add('delete');
      deleteButton.addEventListener('click', this.removeTodo.bind(this));
      task.appendChild(deleteButton);
      this.setLocalStorage();
    } else {
      // To-Do als nicht erledigt markieren und zurück zur offenen Liste verschieben
      event.target.classList.remove('done');
      this.todoList.appendChild(task);
      task.querySelector('.delete').remove();
      this.setLocalStorage();
    }
  }

  // Methode zum Entfernen eines To-Dos
  removeTodo(event) {
    const task = event.target.parentNode;
    task.remove();
    this.setLocalStorage();
  }

  // Methode zur Aktualisierung der lokalen Speicherung
  setLocalStorage() {
    var todoArray = Array.from(this.todoList.children).map(
      (item) => item.textContent
    );
    var doneArray = Array.from(
      this.doneList.querySelectorAll('.todo-item.done')
    ).map((item) => item.textContent);

    var todoString = JSON.stringify(todoArray);
    var doneString = JSON.stringify(doneArray);

    localStorage.setItem('TodoOffen', todoString);
    localStorage.setItem('TodoDone', doneString);
  }

  // Methode zur Aktualisierung des Charakterzählers
  updateCharCounter() {
    // Trimmt den Input und holt die maximale Länge
    const trimmedValue = this.todoInput.value.trim();
    const maxLength = parseInt(this.todoInput.getAttribute('maxlength'));
    const currentLength = trimmedValue.length;
    this.charCounter.textContent = `${currentLength}/22`;

    // Prüft, ob die Zeichenlänge das Limit überschreitet und fügt entsprechende Klasse hinzu oder entfernt sie
    if (currentLength > 22) {
        this.charCounter.classList.add('over-limit');
        this.submitButton.classList.add('over-limit');
    } else {
        this.charCounter.classList.remove('over-limit');
        this.submitButton.classList.remove('over-limit');
    }

    // Prüft ob es input gibt
    if (currentLength > 0) {
        this.submitButton.classList.add('Input');
    } else {
        this.submitButton.classList.remove('Input');
    }
}


  // Methode zur Behandlung der Enter-Taste
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.addTodo();
      event.preventDefault();
    }
  }
}

// Klasse LocalStorage zur Verwaltung der lokalen Speicherung von To-Dos
class LocalStorage {
  constructor(todoManager) {
    this.todoManager = todoManager;
    this.todoList = this.todoManager.todoList;
    this.doneList = this.todoManager.doneList;
    this.loadLocalStorage();
  }

  // Methode zum Erstellen eines neuen To-Do-Elements
  createTaskElement(text) {
    const newButton = document.createElement('button');
    newButton.textContent = text;
    newButton.type = 'button';
    newButton.classList.add('todo-item');
    newButton.addEventListener(
      'click',
      this.todoManager.markAsDone.bind(this.todoManager)
    );
    return newButton;
  }

  // Methode zum Erstellen des Löschen-Buttons für ein To-Do
  createDeleteButton() {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.type = 'button';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', this.removeTodo.bind(this));
    return deleteButton;
  }

  // Methode zum Laden der To-Dos aus dem lokalen Speicher
  loadLocalStorage() {
    var todoList = JSON.parse(localStorage.getItem('TodoOffen')) || [];
    var doneList = JSON.parse(localStorage.getItem('TodoDone')) || [];

    // Erstellt und fügt To-Dos der entsprechenden Listen hinzu
    if (todoList.length > 0) {
      todoList.forEach((item) => {
        const newTask = this.createTaskElement(item);
        const listDiv = document.createElement('div');
        listDiv.appendChild(newTask);
        this.todoList.appendChild(listDiv);
        console.log('todo elemente wurden geladen');
      });
    }

    if (doneList.length > 0) {
      doneList.forEach((item) => {
        const newTask = this.createTaskElement(item);
        const deleteButton = this.createDeleteButton();
        newTask.classList.add('done');
        const listDiv = document.createElement('div');
        listDiv.appendChild(newTask);
        listDiv.appendChild(deleteButton);
        this.doneList.appendChild(listDiv);
        console.log('erledigte elemente wurden geladen');
      });
    }
  }

  // Methode zum Entfernen eines To-Dos
  removeTodo(event) {
    const task = event.target.parentNode;
    task.remove();
    this.todoManager.setLocalStorage();
  }
}

// Event-Listener zum Starten der Anwendung, wenn das Fenster geladen ist
window.addEventListener('load', function () {
  const todoManager = new TodoManager();
  const localStorageInstance = new LocalStorage(todoManager);
});
