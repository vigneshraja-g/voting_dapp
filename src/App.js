import { setSelectionRange } from '@testing-library/user-event/dist/utils';
import { useEffect, useState } from 'react';
import Web3 from 'web3'
import Election from './truffle_abis/Election.json'
import './App.css';

function App() {

  const [account, setAccount] = useState('')
  const [election, setElection] = useState({})

  useEffect(()=>{
     loadWeb3();
     loadBlockchainData();
  },[])

  const loadWeb3= async() =>{
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereuem browser detected! check the MetaMask");
    }
  }
  const loadBlockchainData= async() => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    const networkId = await web3.eth.net.getId();
    const election = Election.networks[networkId];

    if(election){
      const electionSystem = new web3.eth.Contract(
        Election.abi,
        election.address
      );
      setElection(electionSystem);
    }
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
