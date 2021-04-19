/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./App.css";
import Web3 from "web3";
function App() {
  const [account, setAccount] = useState("0x0");

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }
    async function loadBlockchainData() {
      const web3 = window.web3;

      const accounts = await web3.eth.getAccounts();
    }

    return () => {
      loadWeb3();
      loadBlockchainData();
    };
  }, []);

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                404
              </a>

              <h1>Hello, World!</h1>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
