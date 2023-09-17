import { useRef, useState, useEffect } from "react";
import "./App.scss";
import iconMoon from "./assets/images/icon-moon.svg";
import iconSun from "./assets/images/icon-sun.svg";
import Todo from "./Todo";
import uuid from "react-uuid";
import { context } from "./Contexts/context";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function App() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(
    parseInt(localStorage.getItem("items left")) || 0
  );
  const [todos, setTodos] = useState([]);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
    localStorage.setItem("todos", JSON.stringify(items));
  }

  const bgImageRef = useRef(null);
  const toggleThemeRef = useRef(null);
  const createTodoRef = useRef(null);
  const radioRef = useRef(null);
  const todoInputRef = useRef(null);
  const listFooterRef = useRef(null);
  const itemsLeftRef = useRef(null);
  const allRef = useRef(null);
  const activeRef = useRef(null);
  const completedRef = useRef(null);
  const clearRef = useRef(null);

  let changeTheme = [
    bgImageRef,
    toggleThemeRef,
    createTodoRef,
    radioRef,
    todoInputRef,
    listFooterRef,
    itemsLeftRef,
    allRef,
    activeRef,
    completedRef,
    clearRef,
  ];

  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];

  useEffect(() => {
    setTodos(savedTodos);

    if (localStorage.getItem("dark") === "true") {
      document.body.classList.add("dark");
      document.querySelector(".main__todos").classList.add("dark");

      changeTheme.forEach((item) => {
        item.current.classList.add("dark");
      });

      toggleThemeRef.current.src = iconSun;
    }

    if (localStorage.getItem("dark") === "false") {
      document.body.classList.remove("dark");
      document.querySelector(".main__todos").classList.remove("dark");

      changeTheme.forEach((item) => {
        item.current.classList.remove("dark");
      });

      toggleThemeRef.current.src = iconMoon;
    }
  }, []);

  function themeToggler() {
    document.body.classList.toggle("dark");
    document.querySelector(".main__todos").classList.toggle("dark");

    changeTheme.forEach((item) => {
      item.current.classList.toggle("dark");
    });

    if (toggleThemeRef.current.classList.contains("dark")) {
      toggleThemeRef.current.src = iconSun;
      localStorage.setItem("dark", "true");
    } else {
      toggleThemeRef.current.src = iconMoon;
      localStorage.setItem("dark", "false");
    }
  }

  function addTodo(todo) {
    setCount(count + 1);
    localStorage.setItem("items left", count + 1);
    const newTodos = [
      ...todos,
      { id: uuid(), task: todo, checked: false, index: count + 1 },
    ];
    setTodos(newTodos);
    setInput("");
    localStorage.setItem("todos", JSON.stringify(newTodos));
  }

  function deleteTodo(id) {
    setCount(count - 1);
    localStorage.setItem("items left", count - 1);
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  }

  function toggleComplete(id) {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (input) {
      addTodo(input);
      setInput("");
    }
  }

  function allTodos() {
    const newTodos = savedTodos.filter((todo) => todo.id !== "");
    setTodos(newTodos);
  }

  function activeTodos() {
    const newTodos = savedTodos.filter((todo) => todo.checked === false);
    setTodos(newTodos);
  }

  function completedTodos() {
    const newTodos = savedTodos.filter((todo) => todo.checked === true);
    setTodos(newTodos);
  }

  function clearCompleted() {
    const newTodos = todos.filter((todo) => todo.checked === false);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  }

  return (
    <>
      <div ref={bgImageRef} className="bg-image"></div>

      <main className="main">
        <header className="main__header">
          <h1>Todo</h1>
          <img
            onClick={themeToggler}
            ref={toggleThemeRef}
            src={iconMoon}
            id="toggle-theme"
            alt="Theme Toggler Icon"
          />
        </header>

        <form ref={createTodoRef} className="main__createTodo">
          <button
            disabled={!input}
            type="submit"
            onClick={handleSubmit}
            ref={radioRef}
            className="radio"
          ></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={todoInputRef}
            type="text"
            placeholder="Create a new todo..."
          />
        </form>

        <context.Provider value={{ count, setCount }}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="main__todos">
              {(provided) => (
                <ul
                  className="main__todos"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {todos.map((todo, index) => (
                    <Todo
                      task={todo}
                      key={todo.id}
                      deleteTodo={deleteTodo}
                      toggleComplete={toggleComplete}
                      index={index}
                    />
                  ))}

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </context.Provider>

        <footer ref={listFooterRef} className="main__listFooter">
          <small ref={itemsLeftRef} className="main__itemsLeft">
            <span>{count}</span> items left
          </small>
          <ul className="main__states">
            <li ref={allRef} onClick={allTodos}>
              All
            </li>
            <li ref={activeRef} onClick={activeTodos}>
              Active
            </li>
            <li ref={completedRef} onClick={completedTodos}>
              Completed
            </li>
          </ul>
          <small
            ref={clearRef}
            className="main__clear"
            onClick={clearCompleted}
          >
            Clear Completed
          </small>
        </footer>

        <small className="main__dragdrop">Drag and drop to reorder list</small>
      </main>
    </>
  );
}

export default App;
