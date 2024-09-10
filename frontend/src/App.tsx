import { useState, useEffect, FormEvent, useRef } from "react";
import styles from "./styles/style.module.css";
import axios from "axios";

interface Todo {
  id: string;
  title: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function fetchTodo() {
    axios.get("/api/todos").then((res) => {
      setTodos(res.data.todos);
    });
  }
  useEffect(() => {
    const events = new EventSource("/subscribe");
    events.onmessage = (e: any) => {
      fetchTodo();
    };
    fetchTodo();
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries()); // https://medium.com/@hayavuk/react-forms-d49ec73cc84a
    axios({
      method: "post",
      url: "/api/todos",
      data: data,
    }).then(() => {
      if (inputRef && inputRef?.current) {
        console.log({ ref: inputRef.current });
        inputRef.current.value = "";
      }
    });
  }

  function handleDelete(id: string) {
    axios.request({
      method: "delete",
      url: "/api/todos",
      data: { id },
    });
  }

  return (
    <main className="container" style={{ padding: "1rem 0" }}>
      <h1>Server-Sent Events</h1>
      <form onSubmit={handleSubmit} className={`${styles.formCustom}`}>
        <input
          ref={inputRef}
          type="text"
          name="title"
          placeholder="Type something"
        />
        <button type="submit">Submit</button>
      </form>
      {todos.length !== 0 && (
        <>
          {todos.map((todo) => {
            return (
              <article className={styles.todoItem} key={todo.id}>
                <span className={styles.todoText}>{todo.title}</span>
                <span
                  className={styles.trash}
                  onClick={() => handleDelete(todo.id)}
                >
                  <i className="fa-solid fa-xl fa-trash-can"></i>
                </span>
              </article>
            );
          })}
        </>
      )}
    </main>
  );
}

export default App;
