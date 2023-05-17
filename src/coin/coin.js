import React, { useState, useEffect } from "react";
import { useSpring } from "react-spring";
import "./coin.css";
import { useNavigate } from "react-router-dom";
import { Button, useMantineTheme } from "@mantine/core";
import { ethers } from "ethers";
import Web3 from "web3";
import { abi, address, web3_singner } from "../Contractsss/Contract";
import {
  abi_EIXIC,
  address_EIXIC,
  web3_singner_EIXIC,
} from "../Contractsss/ContractEIXIC";
import {
  abi_N225,
  address_N225,
  web3_singner_N225,
} from "../Contractsss/ContractN225";
import LogsDecoder from "logs-decoder";
import moment from "moment";
import CoinModaltest from "./Modals/CoinModaltest";
import HistoryModal from "./StockHistory/HistoryModal";
import CoinGameGuide from "./CoinGameGuide";
import Header_Login from "./Login/Header_Login";
const Coin = ({}) => {
  const [openedGameguide, setOpenedGameguide] = useState(true);
  const history = useNavigate();
  const [historytorfModal, setHistorytorfModal] = useState(false);
  const theme = useMantineTheme();
  const [op, setop] = useState();
  const [openedTWIImodal, setOpenedTWIImodal] = useState(false);
  const [openedEIXICmodal, setOpenedEIXICmodal] = useState(false);
  const [openedN225modal, setOpenedN225modal] = useState(false);
  const [isHovered1, setIsHovered1] = useState(null);
  const [isHovered2, setIsHovered2] = useState(null);
  const [isHovered3, setIsHovered3] = useState(null);
  const [passw, setPassw] = useState("");
  const [user_addr, setuser_addr] = useState("");
  const [TWII, setTWII] = useState("");
  const [TWII_open, setTWII_open] = useState("");
  const [TWII_upDown, setTWII_upDown] = useState(0.0);
  const [EIXIC, setEIXIC] = useState("");
  const [EIXIC_open, setEIXIC_open] = useState("");
  const [EIXIC_upDown, setEIXIC_upDown] = useState(0.0);
  const [N225, setN225] = useState("");
  const [N225_open, setN225_open] = useState("");
  const [N225_upDown, setN225_upDown] = useState(0.0);
  const props = useSpring({
    opacity: isHovered1 ? 1 : 0,
    transform: isHovered1 ? "translateX(0px)" : "translateX(-20px)",
  });

  const props2 = useSpring({
    opacity: isHovered2 ? 1 : 0,
    transform: isHovered2 ? "translateX(0px)" : "translateX(-20px)",
  });

  const props3 = useSpring({
    opacity: isHovered3 ? 1 : 0,
    transform: isHovered3 ? "translateX(0px)" : "translateX(-20px)",
  });
  async function StockApi(stock) {
    const api = await fetch("http://192.192.140.228:8888/" + stock);
    const ans = await api.json();
    if (stock == "EIXIC") {
      setEIXIC(ans.股票成交);
      setEIXIC_open(ans.開盤);
      setEIXIC_upDown(parseFloat(ans.漲跌));
    } else if (stock == "N225") {
      setN225(ans.股票成交);
      setN225_open(ans.開盤);
      setN225_upDown(parseFloat(ans.漲跌));
    } else if (stock == "TWII") {
      setTWII(ans.股票成交);
      setTWII_open(ans.開盤);
      setTWII_upDown(parseFloat(ans.漲跌));
    }
    // console.log(ans);
    return ans.股票成交;
  }
  async function opneStock(address, abi, stocks) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance_singner = new ethers.Contract(address, abi, signer);

    var wallet_address;
    const ether_accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    var account = ether_accounts[0];
    wallet_address = account;

    let ans = await StockApi(stocks);
    // console.log(ans);
    const transaction = await contractInstance_singner.finish(parseInt(ans), {
      from: wallet_address,
    });
    await transaction
      .wait()
      .then((e) => {
        getwinnerinformation(transaction.hash);
        console.log(e);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async function getwinnerinformation(hash) {
    const logsDecoder = LogsDecoder.create();
    logsDecoder.addABI(abi);
    var web3 = new Web3(window["ethereum"] || window.web3.currentProvider); //初始化web3 給他一個權限
    await web3.eth.getTransactionReceipt(hash, function (e, receipt) {
      try {
        const decodedLogs = logsDecoder.decodeLogs(receipt.logs);
        if (decodedLogs[0].name === "SentPrizeToWinner") {
          const timestampDate = parseInt(decodedLogs[0].events[5].value) * 1000;
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

          window.alert(
            "贏家:  " +
              SentPrizeToWinner.winner +
              "\n" +
              "玩家猜測值:  " +
              SentPrizeToWinner.guess +
              "\n" +
              "開獎號碼:  " +
              SentPrizeToWinner.lotterynumber +
              "\n" +
              "贏家獎金:  " +
              SentPrizeToWinner.money +
              "\n" +
              "開牌日期:  " +
              SentPrizeToWinner.timestamp +
              "\n" +
              "第幾場遊戲:  " +
              SentPrizeToWinner.gameindex
          );
          console.log(SentPrizeToWinner);
        }
        if (decodedLogs[1].name === "SentDeveloperFee") {
          let SentDeveloperFee = {
            amount:
              parseInt(decodedLogs[1].events[0].value) / 1000000000000000000,
            balance:
              parseInt(decodedLogs[1].events[1].value) / 1000000000000000000,
          };
          console.log(SentDeveloperFee);
        }
        console.log(decodedLogs);
      } catch {
        window.alert("沒有贏家");
      }
    });
  }
  setTimeout(() => {
    StockApi("EIXIC");
    StockApi("N225");
    StockApi("TWII");
  }, 1);
  useEffect(() => {
    setInterval(() => {
      StockApi("EIXIC");
      StockApi("N225");
      StockApi("TWII");
    }, 20000);
  }, []);
  setTimeout(() => {
    getAccount();
  }, 1);
  async function getAccount() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contractInstance_provider = new ethers.Contract(
      address,
      abi,
      provider
    );
    const ethereum = window.ethereum;
    var accounts = await ethereum.request({ method: "eth_requestAccounts" });
    var wallet_address = accounts[0];
    let op_wallet = await contractInstance_provider.getDeveloperAddress();
    setuser_addr(wallet_address);
    if (wallet_address.toString() == op_wallet.toLowerCase()) {
      setop(true);
    } else {
      setop(false);
    }
  }

  return (
    <>
      <CoinGameGuide
        openedGameguide={openedGameguide}
        setOpenedGameguide={setOpenedGameguide}
      ></CoinGameGuide>
      {historytorfModal && (
        <HistoryModal
          historytorfModal={historytorfModal}
          setHistorytorfModal={setHistorytorfModal}
        ></HistoryModal>
      )}

      <div>
        <img className="cimg" src="../image/back.jpg" />
        <Header_Login setuser_addr={setuser_addr}></Header_Login>
        <Button
          variant="gradient"
          gradient={{ from: "teal", to: "lime", deg: 105 }}
          compact
          onClick={() => {
            setOpenedGameguide(true);
          }}
          style={{
            position: "absolute",
            top: "9%",
            right: "1%",
            zIndex: 10,
          }}
        >
          遊戲規則
        </Button>
        <input
          style={{
            position: "absolute",
            top: "14%",
            right: "1%",
            width: "5%",
            zIndex: 10,
          }}
          onClick={() => setHistorytorfModal(true)}
          type={"image"}
          src="./image/history.png"
        ></input>

        <div className="tbox">
          <p style={{ textAlign: "center", color: "white" }}>
            <h1>玩家錢包地址</h1>
          </p>
          <input
            className="input"
            id="wallet"
            disabled="disabled"
            value={user_addr}
          />
        </div>

        <div className="box">
          <div style={{ margin: "10px", textAlign: "center" }}>
            <div className="dbox">
              <p className="text">台股加權股價指數（台股）</p>
              <p className="text">台股大盤：{TWII}</p>
              <p className="text">(10秒更新一次)</p>
            </div>
            <img
              src="./image/T.png"
              style={{ width: "300px", height: "300px" }}
              alt="123"
              onClick={() => {
                setOpenedTWIImodal(true);
              }}
            />

            <CoinModaltest
              openedmodal={openedTWIImodal}
              setOpenedmodal={setOpenedTWIImodal}
              abi={abi}
              address={address}
              upDown={TWII_upDown}
            ></CoinModaltest>
            <p className="text">TWII:{TWII_open}</p>
            {op ? (
              <>
                <p>
                  <Button
                    onClick={() => opneStock(address, abi, "TWII")}
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan" }}
                  >
                    TWII開盤(合約部屬者only)
                  </Button>
                </p>
              </>
            ) : (
              <></>
            )}
          </div>
          <div style={{ margin: "10px", textAlign: "center" }}>
            <div className="dbox">
              <p className="text">納斯達克指數（美股）</p>
              <p className="text">納斯達克指數：{EIXIC}</p>
              <p className="text">(10秒更新一次)</p>
            </div>
            <img
              src="./image/U.png"
              style={{ width: "300px", height: "300px" }}
              alt="123"
              onClick={() => {
                setOpenedEIXICmodal(true);
              }}
            />
            <CoinModaltest
              openedmodal={openedEIXICmodal}
              setOpenedmodal={setOpenedEIXICmodal}
              abi={abi_EIXIC}
              address={address_EIXIC}
              upDown={EIXIC_upDown}
            ></CoinModaltest>
            <p className="text">EIXIC:{EIXIC_open}</p>
            {op ? (
              <>
                <p>
                  <Button
                    onClick={() => opneStock(address_EIXIC, abi_EIXIC, "EIXIC")}
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan" }}
                  >
                    EIXIC開盤(合約部屬者only)
                  </Button>
                </p>
              </>
            ) : (
              <></>
            )}
          </div>

          <div style={{ margin: "10px", textAlign: "center" }}>
            <div className="dbox">
              <p className="text">日經225指數（日股）</p>
              <p className="text">日經225：{N225}</p>
              <p className="text">(10秒更新一次)</p>
            </div>

            <img
              src="./image/J.png"
              style={{ width: "300px", height: "300px" }}
              alt="123"
              onClick={() => {
                setOpenedN225modal(true);
              }}
            />
            <CoinModaltest
              openedmodal={openedN225modal}
              setOpenedmodal={setOpenedN225modal}
              abi={abi_N225}
              address={address_N225}
              upDown={N225_upDown}
            ></CoinModaltest>
            <p className="text">N225：{N225_open}</p>
            {op ? (
              <>
                <p>
                  <Button
                    onClick={() => opneStock(address_N225, abi_N225, "N225")}
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan" }}
                  >
                    N225開盤(合約部屬者only)
                  </Button>
                </p>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Coin;
