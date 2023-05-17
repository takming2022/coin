import React, { useEffect } from "react";
import { useState } from "react";
import { Modal, Button, Group, Tabs, Table, Skeleton } from "@mantine/core";
import { abi, address, web3_singner } from "../../Contractsss/Contract";
import {
  abi_EIXIC,
  address_EIXIC,
  web3_singner_EIXIC,
} from "../../Contractsss/ContractEIXIC";
import {
  abi_N225,
  address_N225,
  web3_singner_N225,
} from "../../Contractsss/ContractN225";
import HistoryModalTabs from "./HistoryModalTabs";

const HistoryModal = ({ historytorfModal, setHistorytorfModal }) => {
  const [activeTab, setActiveTab] = useState("first");

  return (
    <>
      <Modal
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
        size="xl"
        
        opened={historytorfModal}
        onClose={() => setHistorytorfModal(false)}
        
      >
        <Tabs
          color="green"
          radius="md"
          value={activeTab}
          onTabChange={setActiveTab}
        >
          <Tabs.List>
            <Tabs.Tab value="first">TWII歷史紀錄</Tabs.Tab>
            <Tabs.Tab value="second">EIXIC歷史紀錄</Tabs.Tab>
            <Tabs.Tab value="three">N225歷史紀錄</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="first">
            <HistoryModalTabs
              activeTab={activeTab}
              abi={abi}
              web3_singner={web3_singner}
            ></HistoryModalTabs>
          </Tabs.Panel>
          <Tabs.Panel value="second">
            <HistoryModalTabs
              activeTab={activeTab}
              abi={abi_EIXIC}
              web3_singner={web3_singner_EIXIC}
            ></HistoryModalTabs>
          </Tabs.Panel>
          <Tabs.Panel value="three">
            <HistoryModalTabs
              activeTab={activeTab}
              abi={abi_N225}
              web3_singner={web3_singner_N225}
            ></HistoryModalTabs>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
};

export default HistoryModal;
