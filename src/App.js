import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import { useEffect, useState } from "react";
import Web3 from "web3";
import Election from "./truffle_abis/Election.json";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import Select from "react-select";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [electionSys, setElectionSys] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [winner, setWinner] = useState("");

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);
  useEffect(()=>{
    getCandidates();
    getWinner();
  },[electionSys])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereuem browser detected! check the MetaMask");
    }
  };
  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const election = Election.networks[networkId];

    if (election) {
      const electionSystem = new web3.eth.Contract(
        Election.abi,
        election.address
      );
      setElectionSys(electionSystem);
    }
  };

  const voteCasting = async () => {
    try {
      console.log("vote");
      let res = await electionSys.methods
        .voting(account, selectedCandidate)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          // this.setState({ loading: false });
        });
      console.log("res", res);
      getWinner();
      getCandidates();
    } catch (err) {
      console.log("err", err);
      //  window.alert("Something went wrong");
    }
  };

  const getCandidates = async () => {
    console.log(electionSys)
    var x = await electionSys.methods.candidatesCount().call();

    let arr = [];
    let options = [];
    for (let i = 1; i <= x; i++) {
      await electionSys.methods
        .candidates(i)
        .call()
        .then((candidate) => {
          arr = [
            ...arr,
            { id: candidate[0], name: candidate[1], votes: candidate[2] },
          ];
          options = [...options, { label: candidate[1], value: candidate[0] }];
        });
    }
    setCandidates(arr);
    setCandidateOptions(options);
  };

  const getWinner = async () => {
    try {
      let result = await electionSys.methods.getwinner().call();
      setWinner(result);
      console.log("result", result);
    } catch (err) {
      //  window.alert("Something went wrong");
    }
  };

  return (
    <div className="App">
      <Container>
        <Row className="justify-content-center" style={{ marginTop: "50px" }}>
          <Col xs lg="6">
            <p>Your account: {account}</p>
            <hr />
            <h4>Winner</h4>
            <Row>
              {winner === "0" ? (
                <span>-</span>
              ) : (
                <span>
                  {candidates.map((candidate) => (
                    <span>
                      {candidate.id === winner && (
                        <span>
                          {candidate.name} - {candidate.votes} votes
                        </span>
                      )}
                    </span>
                  ))}
                </span>
              )}
            </Row>
            <hr />
            <h4>Candidates</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Candidate Name</th>
                  <th>Vote count</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, i) => (
                  <tr key={i}>
                    <td>{candidate.id}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.votes}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
            <h4>Vote Cast</h4>
            <Row>
              <div style={{ width: "100%", display: "flex" }}>
                <div style={{ width: "60%" }}>
                  <Select
                    onChange={(e) => setSelectedCandidate(e.value)}
                    options={candidateOptions}
                    placeholder={"Select the Candidate"}
                    // value={selectedCandidate}
                  />
                </div>
                <Button style={{ width: "40%" }} onClick={() => voteCasting()}>
                  Vote
                </Button>
              </div>
            </Row>
            <Row></Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
