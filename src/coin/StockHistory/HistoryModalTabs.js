import React, { useEffect } from "react";
import { useState } from "react";
import { Modal, Button, Group, Tabs, Table, Skeleton } from "@mantine/core";
import Web3 from "web3";
import LogsDecoder from "logs-decoder";
import moment from "moment";
const HistoryModalTabs = ({activeTab,abi,web3_singner}) => {
  //
  const [loading, setLoading] = useState(true);
  const [historytableRow, sethistorytableRow] = useState([]);
  var aa = 0;
  var bb = [];
  web3_singner.events.SentDeveloperFee(
    null,
    { fromBlock: 0, toBlock: "latest" },
    function (error, event) {
      bb[aa] = event.transactionHash;
      aa++;
    }
  );
  async function getHistorylist() {
    const logsDecoder = LogsDecoder.create();
    logsDecoder.addABI(abi);
    var web3 = new Web3(window["ethereum"] || window.web3.currentProvider);
    let obj = [];
    for (var i = bb.length - 1; i >= 0; i--) {
      await web3.eth.getTransactionReceipt(bb[i], function (e, receipt) {
        try {
          const decodedLogs = logsDecoder.decodeLogs(receipt.logs);
          if (decodedLogs[0].name === "SentPrizeToWinner") {
            const timestampDate =
              parseInt(decodedLogs[0].events[5].value) * 1000;
            const timestampNewDate = moment(new Date(timestampDate)).format(
              "yyyy年MM月DD日 HH時mm分ss秒"
            );
            let SentPrizeToWinner = {
              winner: decodedLogs[0].events[0].value,
              money:
                parseInt(decodedLogs[0].events[1].value) / 1000000000000000000,
              guess: parseInt(decodedLogs[0].events[2].value),
              gameindex: parseInt(decodedLogs[0].events[3].value),
              lotterynumber: parseInt(decodedLogs[0].events[4].value),
              timestamp: timestampNewDate,
            };
            console.log(obj);
            obj.push(SentPrizeToWinner);
          }
          if (decodedLogs[1].name === "SentDeveloperFee") {
            let SentDeveloperFee = {
              amount:
                parseInt(decodedLogs[1].events[0].value) / 1000000000000000000,
              balance:
                parseInt(decodedLogs[1].events[1].value) / 1000000000000000000,
            };
          }
        } catch {
          const timestampNewDate = moment(new Date()).format(
            "yyyy年MM月DD日 HH時mm分ss秒"
          );
          let SentPrizeToWinner = {
            winner: "沒有贏家",
            money: 0,
            guess: 0,
            gameindex: 0,
            lotterynumber: 0,
            timestamp: timestampNewDate,
          };
          console.log(obj);
          obj.push(SentPrizeToWinner);
          console.log("沒有贏家");
        }
      });
    }
    setHistorylist(obj);
  }
  async function setHistorylist(obj) {
    const rows = await obj.map((element) => (
      <tr key={element.gameindex}>
        <td>{hidden(element.winner)}</td>
        <td>{element.money}</td>
        <td>{element.guess}</td>
        <td>{element.gameindex}</td>
        <td>{element.lotterynumber}</td>
        <td>{element.timestamp}</td>
      </tr>
    ));
    sethistorytableRow(rows);
    setLoading(false);
  }
  function hidden(str) {
    return str.substring(0, 12) + "...." + str.substring(str.length - 10);
  }

  useEffect(() => {
    setTimeout(async () => {
      getHistorylist();
    }, 1000);
  }, [activeTab]);
  return (
    <>
      <Skeleton visible={loading}>
        <Table
          striped
          withColumnBorders
          highlightOnHover
          horizontalSpacing="xs"
          verticalSpacing="lg"
          fontSize="md"
        >
          <thead>
            <tr>
              <th>贏家</th>
              <th>獎金</th>
              <th>猜測值</th>
              <th>遊戲編號</th>
              <th>系統猜測值</th>
              <th>時間</th>
            </tr>
          </thead>
          <tbody>{historytableRow}</tbody>
        </Table>
      </Skeleton>
    </>
  );
};

export default HistoryModalTabs;
