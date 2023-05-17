import React, { useState } from "react";
import {
  Modal,
  Button,
  Group,
  useMantineTheme,
  Radio,
  Input,
  TextInput,
  Flex,
  Text,
} from "@mantine/core";
import { ethers } from "ethers";
import Web3 from "web3";
import { rgba } from "@react-spring/shared";
const CoinModaltest = ({
  openedmodal,
  setOpenedmodal,
  abi,
  address,
  upDown,
}) => {
  const theme = useMantineTheme();
  const [guessvalue, setguessvalue] = useState(0);
  async function addguesses() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance_singner = new ethers.Contract(address, abi, signer);
    const contractInstance_provider = new ethers.Contract(
      address,
      abi,
      provider
    );
    var wallet_address;
    const ether_accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    var account = ether_accounts[0];
    wallet_address = account;
    let amount = Web3.utils.toWei("0.01");
    const transaction = await contractInstance_singner.addguess(
      parseInt(guessvalue),
      { from: wallet_address, value: amount }
    );
    alert("下注成功!請等待合約互動");
    setOpenedmodal(false);
    await transaction.wait().then((e) => {
      alert("下注成功!您下注的數字為" + guessvalue.toString());
      console.log(e);
    });
  }
  return (
    <>
      <Modal
        radius="lg"
        style={{ backgroundColor: "pink" }}
        opened={openedmodal}
        centered
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[1]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        size="40%"
        onClose={() => setOpenedmodal(false)}
        title="請輸入您的股票猜測價格"
      >
        <Flex
          style={{ borderRadius: "20px" }}
          mih={50}
          bg="rgba(0, 0, 0, .3)"
          gap="xl"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Group position="center">
            <Flex
              mih={50}
              gap="xl"
              justify="center"
              align="center"
              direction="row"
              wrap="wrap"
            >
              {upDown > 0 ? (
                <>
                  <Text fz="xl" color={"red"}>
                    漲 : {upDown}
                  </Text>
                </>
              ) : (
                <>
                  <Text fz="xl" color={"green"}>
                    跌 : {upDown}
                  </Text>
                </>
              )}
            </Flex>
          </Group>
          <Flex
            mih={50}
            s
            gap="xl"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            style={{ marginBottom: "10px" }}
          >
            <TextInput
              label="下注價格"
              radius="md"
              size="md"
              value={"0.01"}
              disabled
            />
            <Input
              value={guessvalue}
              onChange={(e) => {
                setguessvalue(e.target.value);
              }}
              placeholder="請輸入你的猜測值"
              radius="md"
              size="md"
              maxLength={6}
            />
            <Button
              radius="xl"
              size="md"
              onClick={addguesses}
              variant="gradient"
              gradient={{ from: "teal", to: "lime", deg: 105 }}
            >
              確認下注
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};

export default CoinModaltest;
