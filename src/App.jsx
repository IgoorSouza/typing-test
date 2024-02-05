import { useState, useEffect } from "react";
import axios from "axios";

let textsToType = [];

function App() {
  const [isTyping, setIsTyping] = useState(false);
  const [currentTextToType, setCurrentTextToType] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [history, setHistory] = useState([]);

  const toggleTheme = () => {
    let body = document.getElementsByTagName("body")[0];

    if (body.classList.contains("dark")) {
      localStorage.removeItem("darkTheme");
    } else {
      localStorage.setItem("darkTheme", true);
    }

    body.classList.toggle("dark");
  };

  const fetchTexts = () => {
    axios({
      method: "get",
      url: "https://api.api-ninjas.com/v1/dadjokes?limit=10",
      headers: { "X-Api-Key": "R1MN4GdYTNJAQ8tbh/y/dg==PnqDgfyX1Gfle8Om" },
      responseType: "json",
    })
      .then((res) => (textsToType = res.data))
      .then(() => getTextToType());
  };

  const getTextToType = () => {
    if (textsToType.length > 0) {
      let randomText = [Math.floor(Math.random() * textsToType.length)];
      let newText = textsToType[randomText].joke;

      textsToType.splice(randomText, 1);

      setCurrentTextToType(newText);
    } else {
      setCurrentTextToType(null);
      fetchTexts();
    }
  };

  useEffect(() => {
    let darkTheme = localStorage.getItem("darkTheme");

    if (darkTheme && darkTheme !== false) {
      let body = document.getElementsByTagName("body")[0];
      body.classList.add("dark");
    }

    let getHistory = localStorage.getItem("history");
    if (getHistory !== null) setHistory(JSON.parse(getHistory));

    fetchTexts();
  }, []);

  const getText = (event) => {
    if (!isTyping) {
      setStartTime(Date.now());
      setIsTyping(true);
    } else if (event.target.value === currentTextToType) {
      event.target.value = "";
      let time = (Date.now() - startTime) / 1000;

      setTimeSpent(time);
      setStartTime(0);
      setIsTyping(false);
      setHistory([
        ...history,
        {
          text: currentTextToType,
          time,
        },
      ]);
      localStorage.setItem(
        "history",
        JSON.stringify([
          ...history,
          {
            text: currentTextToType,
            time,
          },
        ])
      );

      getTextToType();
    }
  };

  const restart = () => {
    setHistory([]);
    setTimeSpent(0);
    getTextToType();
    localStorage.removeItem("history");
  };

  return (
    <div className="container">
      <button className="toggleTheme" onClick={toggleTheme}>
        Alternar tema
      </button>

      <div className="content">
        <h1>Teste de Velocidade de Digitação (Inglês)</h1>

        <p>
          Para começar o teste, clique na caixa de texto abaixo e comece a
          digitar o texto exibido acima dela. O cronômetro começará
          automaticamente assim que você começar a digitar. Quando você terminar
          de digitar o texto corretamente, o tempo que você levou será exibido.
          Lembre-se de diferenciar letras maiúsculas e minúsculas e preste
          atenção na pontuação!
        </p>

        <div className="textToType">
          <p>{currentTextToType ?? "Carregando frase..."}</p>
        </div>

        <textarea
          rows="5"
          placeholder="Digite o texto aqui..."
          disabled={!currentTextToType}
          onPaste={(event) => {
            event.preventDefault();
          }}
          onChange={getText}
        />

        {timeSpent != 0 ? (
          <h3>Parabéns! Você levou {timeSpent} segundos.</h3>
        ) : null}

        <button
          className="restartButton"
          onClick={restart}
          disabled={history.length === 0}
        >
          Reiniciar
        </button>

        <div className="history">
          {history.map((item, index) => {
            return (
              <p key={index}>
                Texto: &quot;{item.text}&quot; - {item.time} segundos
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
