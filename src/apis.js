const transactRequest = (ledger, body) => {
  console.log(ledger);
  console.log(body);
  return fetch("http://localhost:8090/fdb/" + ledger + "/transact", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

const LedgerStateRequest = async (ledger) => {
  return fetch("http://localhost:8090/fdb/" + ledger + "/ledger-stats", {
    method: "POST",
  });
};

export { transactRequest, LedgerStateRequest };
