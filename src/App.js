import { useEffect, useState } from 'react';
import Web3 from 'web3'
import './App.css';

function App() {

  const [account, setAccount] = useState('')

  useEffect(()=>{
    loadBlockchainData()
  },[])

  const loadBlockchainData= async() => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Your account: {account}</p>
      </header>
    </div>
  );
}

export default App;
