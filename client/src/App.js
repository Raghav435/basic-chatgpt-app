import "./App.css";
import { useEffect, useState } from "react";

function App() {
  useEffect(() => {
    getEngines();
  }, []);
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("ada");
  const [chatlog, setChatlog] = useState([
    {
      user: "gpt",
      message: "How can i help you?",
    },
    {
      user: "me",
      message: "I want to use chatgpt today",
    },
  ]);

  function clearChat() {
    setChatlog([]);
  }

  function getEngines() {
    fetch("http://localhost:3080/models")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.models);
        setModels(data.models);
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatlog, { user: "me", message: `${input}` }];
    setInput("");
    setChatlog(chatLogNew);

    const message = chatLogNew.map((message) => message.message).join("\n");

    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        currentModel
      }),
    });
    const data = await response.json();
    setChatlog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
  }
  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className="models">
          <select onChange={(e)=> setCurrentModel(e.target.value)}>
            {models.map((model, index) => (
              <option key={model.id} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatlog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="1"
              className="chat-input-textarea"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
          {message.user === "gpt"}
        </div>
        <div className="message">{message.message}</div>
      </div>
    </div>
  );
};

export default App;
