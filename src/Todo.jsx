import { useContext, useEffect, useRef } from "react";
import iconCross from "./assets/images/icon-cross.svg";
import iconCheck from "./assets/images/icon-check.svg";
import { context } from "./Contexts/context";
import { Draggable } from "react-beautiful-dnd";

const Todo = ({ task, deleteTodo, toggleComplete, index }) => {
  const { setCount } = useContext(context);
  const { count } = useContext(context);

  const radio = useRef(null);

  function itemsLeftCheck() {
    if (radio.current.classList.contains("check")) {
      setCount(count + 1);
      localStorage.setItem("items left", count + 1);
    } else {
      setCount(count - 1);
      localStorage.setItem("items left", count - 1);
    }
  }

  function itemsLeftDelete() {
    if (radio.current.classList.contains("check")) {
      setCount(count);
      localStorage.setItem("items left", count);
    } else {
      setCount(count - 1);
      localStorage.setItem("items left", count - 1);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("dark") === "true") {
      document.querySelectorAll(".main__todoItem").forEach((item) => {
        item.classList.add("dark");
      });
      radio.current.classList.add("dark");
    } else {
      document.querySelectorAll(".main__todoItem").forEach((item) => {
        item.classList.remove("dark");
      });
      radio.current.classList.remove("dark");
    }
  }, []);

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <li
          className="main__todoItem"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            ref={radio}
            className={`radio ${task.checked ? "check" : ""}`}
            onClick={() => {
              toggleComplete(task.id);
              itemsLeftCheck();
            }}
          >
            {task.checked ? <img src={iconCheck} /> : ""}
          </div>
          <span className={`${task.checked ? "finished" : ""}`}>
            {task.task}
          </span>
          <img
            onClick={() => {
              deleteTodo(task.id);
              itemsLeftDelete();
            }}
            src={iconCross}
            className="main__iconCross"
            alt="Icon Cross"
          />
        </li>
      )}
    </Draggable>
  );
};

export default Todo;
