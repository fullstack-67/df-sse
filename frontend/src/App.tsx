import { useState, useEffect, FormEvent } from "react";
// import styles from "./styles/style.module.css";
import axios from "axios";

interface Todo {
  id: string;
  title: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
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
    return axios({
      method: "post",
      url: "/api/todos",
      data: data,
    });
  }

  return (
    <main className="container" style={{ padding: "1rem 0" }}>
      <h1>Server-Sent Events</h1>
      <article>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" />
          <button type="submit">Submit</button>
        </form>
      </article>
      <article>
        <ul>
          {todos.map((todo) => {
            return <li>{todo.title}</li>;
          })}
        </ul>
      </article>
    </main>
  );
}

export default App;
