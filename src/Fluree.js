import React, { useEffect, useState } from "react";
import "./App.css";

import {
  Table,
  Tabs,
  Tab,
  InputGroup,
  FormControl,
  Button,
  Navbar,
  Card,
  ListGroup,
  Row,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { FlureeProvider, flureeQL } from "@fluree/js-react-wrapper";

import { AiFillDelete } from "react-icons/ai";
import { transactRequest } from "./apis";

import flureenjs from "@fluree/flureenjs";

function Fluree({ ledger, flureeDbConn, flureeConnection }) {
  const [key, setKey] = useState("new-user");
  
  const [blocks, setbloacks] = useState();
  const [size, setsize] = useState();
  const [status, setstatus] = useState();
  const [flakes, setflakes] = useState();

  useEffect(() => {
    MainRender();
  }, [flureeConnection]);

  function MainRender() {
    const ShowPredicatesFluree = flureeQL({
      select: ["*"],
      from: "users",
    })(ShowPredicates);

    return (
      <FlureeProvider conn={flureeConnection}>
        <div className="App-container mt-4">
          <LedgerStateDesign />
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="new-user" title="New User">
              <AddNewUser />
            </Tab>
            <Tab eventKey="update-balance" title="Update Balance">
              <UpdateUser />
            </Tab>
          </Tabs>
          <ShowPredicatesFluree></ShowPredicatesFluree>
        </div>
      </FlureeProvider>
    );
  }

  function ShowPredicates({ data }) {
    return (
      <Table bordered={true} className="Table-container">
        <thead>
          <tr>
            <th>Id</th>
            <th>Fisrt Name</th>
            <th>last Name</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.result.map((predicate, index) => (
            <PredicateItem key={index} predicate={predicate} />
          ))}
        </tbody>
      </Table>
    );
  }

  function PredicateItem({ predicate, index }) {
    return (
      <tr>
        <th>{predicate._id}</th>
        <th>{predicate.firstName}</th>
        <th>{predicate.lastName}</th>
        <th>{predicate.balance}</th>
        <th>
          <AiFillDelete
            color="red"
            size="25"
            onClick={() => {
              transactRequest(ledger, [
                {
                  _id: predicate._id,
                  _action: "delete",
                },
              ]).then(() => {
                LedgerState();
              });
            }}
          />
        </th>
      </tr>
    );
  }

  function AddNewUser() {
    const [error, seterror] = useState(false);

    const [firstName, setfirstName] = useState();
    const [lastName, setlastName] = useState();
    const [balance, setbalance] = useState();

    return (
      <div className="AddNewUser-div">
        <InputGroup size="sm">
          <InputGroup.Text id="inputGroup1">First name</InputGroup.Text>
          <FormControl
            aria-label="First Name"
            aria-describedby="inputGroup1"
            value={firstName}
            onChange={(event) => {
              setfirstName(event.target.value);
              seterror(false);
            }}
          />
          <InputGroup.Text id="inputGroup2">Last name</InputGroup.Text>
          <FormControl
            aria-label="Last Name"
            aria-describedby="inputGroup2"
            value={lastName}
            onChange={(event) => {
              setlastName(event.target.value);
              seterror(false);
            }}
          />
          <InputGroup.Text id="inputGroup3">Balance</InputGroup.Text>
          <FormControl
            aria-label="Balance"
            aria-describedby="inputGroup3"
            value={balance}
            onChange={(event) => {
              setbalance(event.target.value);
              seterror(false);
            }}
          />
          <Button
            className="p-2"
            onClick={() => {
              if (!firstName || !lastName || !balance) {
                seterror(true);
                return;
              }

              if (!parseFloat(balance)) {
                seterror(true);
                return;
              }

              transactRequest(ledger, [
                {
                  _id: "users",
                  firstName: firstName,
                  lastName: lastName,
                  balance: parseFloat(balance),
                },
              ]).then(() => {
                LedgerState();
                setfirstName("");
                setlastName("");
                setbalance("");
                // console.log(firstName, lastName, balance);
              });
            }}
          >
            Add
          </Button>
        </InputGroup>
        {error ? (
          <Navbar.Text className="Error-text">Invalid data</Navbar.Text>
        ) : null}
      </div>
    );
  }

  function UpdateUser() {
    const [error, seterror] = useState(false);

    const [userId, setuserId] = useState();
    const [balance, setbalance] = useState();

    return (
      <div className="AddNewUser-div">
        <InputGroup size="sm">
          <InputGroup.Text id="inputGroup1">User Id</InputGroup.Text>
          <FormControl
            aria-label="User Id"
            aria-describedby="inputGroup1"
            value={userId}
            onChange={(event) => {
              setuserId(event.target.value);
              seterror(false);
            }}
          />
          <InputGroup.Text id="inputGroup2">Balance</InputGroup.Text>
          <FormControl
            aria-label="Balance"
            aria-describedby="inputGroup2"
            value={balance}
            onChange={(event) => {
              setbalance(event.target.value);
              seterror(false);
            }}
          />
          <Button
            className="p-2"
            onClick={() => {
              if (!userId || !balance) {
                seterror(true);
                return;
              }

              transactRequest(ledger, [
                {
                  _id: parseFloat(userId),
                  balance: balance,
                },
              ]).then(() => {
                LedgerState();
                setuserId("");
                setbalance("");
                // console.log(firstName, lastName, balance);
              });
            }}
          >
            Update
          </Button>
        </InputGroup>
        {error ? (
          <Navbar.Text className="Error-text">Invalid data</Navbar.Text>
        ) : null}
      </div>
    );
  }

  function LedgerState () {
    flureenjs
      .ledger_stats(flureeDbConn, ledger)
      .then((results) => {
        setstatus(results.status);
        setbloacks(results.block);
        setsize(results.size);
        setflakes(results.flakes);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function LedgerStateDesign() {
    LedgerState();
    return (
      <Row md={4} className="mb-3 w-100">
        <Card style={{ textAlign: "center" }}>
          <Card.Header>Status</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>{status}</ListGroup.Item>
          </ListGroup>
        </Card>
        <Card style={{ textAlign: "center" }}>
          <Card.Header>Blocks</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>{blocks}</ListGroup.Item>
          </ListGroup>
        </Card>
        <Card style={{ textAlign: "center" }}>
          <Card.Header>Size</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>{size}</ListGroup.Item>
          </ListGroup>
        </Card>
        <Card style={{ textAlign: "center" }}>
          <Card.Header>Flakes</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>{flakes}</ListGroup.Item>
          </ListGroup>
        </Card>
      </Row>
    );
  }

  return <MainRender />;
}

export default Fluree;
