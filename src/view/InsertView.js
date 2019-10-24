import React, { useEffect, useState, useCallback, useRef } from 'react';

const initState = {
  descricao: '',
  tempo: '',
};

const InsertView = () => {
  const connection = useRef();
  const startWebSocketTimeout = useRef();
  const [state, setState] = useState(initState);
  const startWebSocket = useCallback(() => {
    const url = 'ws://localhost:8083';
    connection.current = new WebSocket(url);

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
  }, []);

    function handleChange(event) {
      event.persist();
      setState((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value,
      }));
    }

    function handleSubmit() {
         const payload = {
           event: 'insert',
            tempo: state.tempo,
            descricao: state.descricao,
         };
         connection.current.send(JSON.stringify(payload));
         document.getElementById("tempo").value = '';
         document.getElementById("descricao").value = '';
     }

     useEffect(() => {
      startWebSocket();
      return () => {
        if (connection.current) {
          connection.current.close();
          clearTimeout(startWebSocketTimeout);
        }
      };
    }, [connection, startWebSocket]);

  return (
    <div className="container">
        <h1>Websocket com Seu Cesar! Parte 2</h1>
        <input type="text" id="tempo" placeholder="Tempo" maxLength="6" onChange={handleChange} value={state.tempo}  />
        <input type="text" id="descricao" placeholder="Descrição" onChange={handleChange} value={state.descricao}/>
        <button className="btn btn-success" id="send-data" onClick={()=> handleSubmit()}>Enviar</button>
    </div>
  );
}

export default InsertView;
