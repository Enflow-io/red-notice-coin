// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RNModule = buildModule("RNModule", (m) => {

  const lock = m.contract("RncToken", ['0xa2551e765771861b0c9DB18b98e9C4C6B91bF34a']);

  return { lock };
});

export default RNModule;
