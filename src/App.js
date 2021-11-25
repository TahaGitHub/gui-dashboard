import React, { useEffect, useState } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

// eslint-disable-next-line
import flureenjs from "@fluree/flureenjs";
import Fluree from "./Fluree";

import { ReactConnect } from "@fluree/js-react-wrapper";

// import flureeworker from "../src/flureeworker.js";

const flureeServerUrl = "http://localhost:8090";
// const flureeLedger = "mytest/test1";

let flureeDbConn = flureenjs.connect(flureeServerUrl);

const App = (props) => {
  const [flureeConnection, setflureeConnection] = useState();
  const [listOfLedger, setlistOfLedger] = useState([[]]);
  const [value, setValue] = useState("default");

  useEffect(() => {
    ledgersList().then((res) => {
      setlistOfLedger(res);
    });
  }, []);

  return (
    <div className="App-container">
      <p className="App-header">Fluree users data</p>
      <select
        id="lang"
        onChange={(e) => {
          setValue(e.target.value);

          if (flureeConnection) {
            flureeConnection.close();
          }

          console.log(process.env)
          const _flureeConnection = new ReactConnect({
            servers: flureeServerUrl, // point to URL of running Fluree transactor or peer server
            ledger: e.target.value, // default ledger (database) on the server to use for this connection
            workerUrl: 'flureeworker.js', // location of the fluree web worker javascript file
          });

          setflureeConnection(_flureeConnection);
        }}
        value={value}
      >
        <option value="default" disabled hidden>
          Select ledger
        </option>
        {listOfLedger.map((item, index) => (
          <option key={index} value={item[0] + "/" + item[1]}>
            {item[0] + "/" + item[1]}
          </option>
        ))}
      </select>

      {flureeConnection ? (
        <Fluree
          ledger={value}
          flureeDbConn={flureeDbConn}
          flureeConnection={flureeConnection}
        />
      ) : null}
    </div>
  );
};

const ledgersList = () => {
  return flureenjs
    .ledger_list(flureeDbConn)
    .then((results) => {
      return results;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};

export default App;
