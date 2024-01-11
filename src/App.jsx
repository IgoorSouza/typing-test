import { useState, useEffect } from "react";

const textsToType = [
  "Digite isso.",
  "Outro exemplo de texto para digitar.",
  "Mais um texto.",
  "Este é um teste de digitação."
];

function App() {
  const [isTyping, setIsTyping] = useState(false);
  const [currentTextToType, setCurrentTextToType] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [history, setHistory] = useState([]);

  const toggleTheme = () => {
    let body = document.getElementsByTagName("body")[0];
    body.classList.toggle("dark");
  };

  const getTextToType = () => {
    let newText = textsToType[Math.floor(Math.random() * textsToType.length)];

    while (newText === currentTextToType) {
      newText = textsToType[Math.floor(Math.random() * textsToType.length)];
    }

    setCurrentTextToType(newText);
  };

  useEffect(() => {
    getTextToType();
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

      getTextToType();
    }
  };

  const restart = () => {
    setHistory([]);
    setTimeSpent(0);
    getTextToType();
  };

  return (
    <div className="container">
      <button className="toggleTheme" onClick={toggleTheme}>
        Alternar tema
      </button>

      <div className="content">
        <h1>Teste de Velocidade de Digitação</h1>

        <p>
          Para começar o teste, clique na caixa de texto abaixo e comece a
          digitar o texto exibido acima dela. O cronômetro começará
          automaticamente assim que você começar a digitar. Quando você terminar
          de digitar o texto corretamente, o tempo que você levou será exibido.
        </p>

        <div className="textToType">
          <p>{currentTextToType}</p>
        </div>

        <textarea
          rows="5"
          placeholder="Digite o texto aqui..."
          onChange={getText}
        />

        {timeSpent != 0 ? (
          <h3>Parabéns! Você levou {timeSpent} segundos.</h3>
        ) : null}

        <button className="restartButton" onClick={restart} disabled={history.length === 0}>
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
