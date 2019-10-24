import React, { useEffect, useCallback, useRef, useState } from 'react';
import guid from '../utils/guid';

const initState = {
  lances: [],
}

const ListView = () => {
  const [state, setState] = useState(initState);
  const connection = useRef();
  const startWebSocketTimeout = useRef();

  const startWebSocket = useCallback(() => {
    const url = 'ws://localhost:8083';
    connection.current = new WebSocket(url);

    connection.current.onopen = (evt) => {
      console.log('Abre Conexão', evt);
      const payload = JSON.stringify({
        event: 'read-only',
        tempo: '',
        descricao: '',
      });
      connection.current.send(payload);
    }

    connection.current.onmessage = (evt) => {
      const dataJson = evt.data.split(",");
      setState((prevState) => ({
        ...prevState,
        lances: dataJson,
      }));
    }

    connection.current.onerror = (error) => {
      console.log(`Erro no WebSocket :( ${error}`);
    }

    connection.current.onclose = () => {
      console.log("Connexão fechada!");
      connection.current = null;
      startWebSocketTimeout.current = setTimeout(startWebSocket, 5000);
    }
  }, [setState]);

  useEffect(() => {
    startWebSocket();
    return () => {
      if (connection.current) {
        connection.current.close();
        clearTimeout(startWebSocketTimeout);
      }
    };
  }, [startWebSocket]);

  console.log('state.lances', state.lances);
  return (
  <div className="container">
    <h1>Websocket com Seu Cesar! Parte 2</h1>
    <p>Flamengo x Fluminense</p>
    <button className="btn btn-success" id="reopen-connection">Abrir Conexão</button>
    <button className="btn btn-danger" id="close-connection">Fechar Conexão</button>
    <p><strong>Mensagem Recebida do Socket</strong></p>
    <ul id="msg" className="list-group" >
      {state.lances.map((item) => (
        <li className="list-group-item" key={guid()}>{item}</li>
      ))}
    </ul>
  </div>
  );
}

export default ListView;
