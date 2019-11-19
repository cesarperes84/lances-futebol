import React, { useEffect, useState, useCallback, useRef } from 'react';

const initState = {
  alert: '',
  descricao: '',
  tempo: '',
};

const InsertLance = () => {
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

    function handleCloseButton() {
       setState((prevState) => ({
       ...prevState,
       alert: '',
     }));
  }

    function handleSubmit() {
         const payload = {
           event: 'insert',
            tempo: state.tempo,
            descricao: state.descricao,
         };
         connection.current.send(JSON.stringify(payload));
          setState((prevState) => ({
          ...prevState,
          alert: 'success',
          tempo: '',
          descricao: '',
        }));
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
    <main role="main" className="container">
      <h2>Novo Lance</h2>
      <div className="form-group">
            <label>Tempo: </label>
            <input type="text" className="form-control" id="tempo" placeholder="00:00" maxLength="6" onChange={handleChange} value={state.tempo}  />
          </div>
          <div className="form-group">
            <label>Descrição: </label>
            <input type="text" className="form-control" id="descricao" placeholder="O que está acontecendo no jogo..." onChange={handleChange} value={state.descricao}/>
          </div>
          {(state.alert === 'success') && 
            (<div className="alert alert-success" role="alert">Enviado com sucesso!
               <button type="button" className="close" onClick={()=> handleCloseButton()}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>)
          }
          {(state.alert === 'error') && 
            (<div className="alert alert-danger" role="alert">
              Erro! Tente novamente.
              <button type="button" className="close" onClick={()=> handleCloseButton()}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>)
          }
          <button className="btn btn-success" id="send-data" onClick={()=> handleSubmit()}>Enviar</button>
    </main>
  );
}

export default InsertLance;
