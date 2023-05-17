import React from "react";
import { useState } from "react";
import { Modal, Button, Group, Accordion, Text, Box } from "@mantine/core";
const CoinGameGuide = ({ openedGameguide, setOpenedGameguide }) => {
  return (
    <>
      <Modal opened={openedGameguide} onClose={() => setOpenedGameguide(false)}>
        <Box style={{ marginBottom: "40px" }}>
          <Text
            variant="gradient"
            gradient={{ from: "teal", to: "lime", deg: 105 }}
            ta="center"
            fw={700}
            fz="xl"
            color={"red"}
          >
            遊戲規則!
          </Text>
          <Text
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            ta="center"
            fz="md"
            color={"red"}
          >
            本遊戲為預測開盤的那個當下股票指數
          </Text>
          <Text ta="center" fz="md" color={"red"}>
            開盤時區為(UTC+8)
          </Text>
          <Text ta="center" fz="md" color={"red"}>
            10:00開台股大盤
          </Text>
          <Text ta="center" fz="md" color={"red"}>
            9:00開日經255
          </Text>
          <Text ta="center" fz="md" color={"red"}>
            22:00開美股
          </Text>
        </Box>
        <Accordion
          variant="contained"
          radius="md"
          chevronPosition="left"
          defaultValue=""
          transitionDuration={1000}
        >
          <Accordion.Item value="customization">
            <Accordion.Control>我要如何知道賭局的歷史紀錄?</Accordion.Control>
            <Accordion.Panel>
              主畫面的右上角，遊戲規則按鈕下面的圖片按鈕按下之後即可看到歷史紀錄!
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="flexibility">
            <Accordion.Control>我可以知道股票的漲跌嗎?</Accordion.Control>
            <Accordion.Panel>
              只要點進投票頁面，在畫面的上方就會顯示，紅色一律代表漲，綠色一律代表跌!
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="focus-ring">
            <Accordion.Control>要如何知道台股，美股，日股的當前狀態?</Accordion.Control>
            <Accordion.Panel>
             在投票箱子的下方有顯示當前是開盤，收盤，以及時間等資訊!
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Modal>
    </>
  );
};

export default CoinGameGuide;
