const { ethers } = require("hardhat");
const axios = require("axios");

const ROOT_URL = "https://rednotice.run";

async function main() {

  /*
  const accounts = await hre.ethers.getSigners();
  const account = accounts[0];

  const collectionUrl = "http://localhost:3003/api/nft/collections";
  const collections = await axios.get(collectionUrl);

  for (let collection of collections.data) {
    console.log("collection", collection);
    if(collection.name === "ASHEN STABBING GUILT BROKEN MEMORY"){
      continue;
    }
    const collectionAddress = collection.address;
    const NFT = await ethers.getContractAt("RncToken", collectionAddress, account);
    const maxTokenId = 11;
    const tokenIds = [];

    for (let i = 0; i < maxTokenId; i++) {
      try {
        const uri = await NFT.tokenURI(i);
        tokenIds.push({
          id: i,
          uri
        });
      } catch (e) {
        console.log("Error fetching token ID:", e);
        break;
      }
    }

    console.log("Accessible Token IDs:", tokenIds);

    for (tokenData of tokenIds) {
      const uri = tokenData.uri; //"https://rednotice.run/api/nft/token/ASHEN_STRIKING_PRISON_FORSAKEN_SORROW-BETRAYER_FATAL.json"

      const tokenName = (uri.split('/').pop().split('.json')[0].split('-').pop()).replace(/_/g, " ");
      console.log("CollectionName", collection.name);
      console.log("Extracted Token Name:", tokenName);

      const updateUrl = `http://localhost:3003/api/nft/update-token-by-name`;
      try {
        await axios.post(updateUrl, {
          tokenId: tokenData.id,
          collection: collection.name,
          tokenName: tokenName
        });
        console.log(`Updated tokenId for NFT with ID: ${tokenData.id}`);
      } catch (updateError) {
        console.error(`Failed to update tokenId for NFT with ID: ${tokenData.id}`, updateError);
      }

    }



  }



  process.exit()

  */


  const accounts = await hre.ethers.getSigners();
  const account = accounts[0];

  const getCollectionList = async (collectionAddress) => {
    const NFT = await ethers.getContractAt("RncToken", collectionAddress, account);
    const maxTokenId = 11;
    const tokenUris = [];

    for (let i = 0; i < maxTokenId; i++) {
      try {
        const uri = await NFT.tokenURI(i);
        tokenUris.push({
          id: i,
          uri
        });
      } catch (e) {
        console.log("Error fetching token ID:", e);
        break;
      }
    }

    return tokenUris;
  }

  const url = `${ROOT_URL}/api/nft`;

  try {
    const response = await axios.get(url);
    console.log("JSON Response:", response.data.length);


    for (let item of response.data) {
      if (item.tokenId !== null) {
        continue;
      }
      console.log('--=================--------')

      const collectionName = item.collection;
      const nftName = item.name;


      const ownerAddr = "0xA1Fe3F1e668e1F0BdD1818b8859C34Eea3BaC467";

      const erc721address = item.collectionAddress;

      const NFT = await ethers.getContractAt("RncToken", erc721address, account);

      const collectionUri = collectionName.replace(/\s+/g, "_").toUpperCase();
      const nftUri = nftName.replace(/\s+/g, "_").toUpperCase();
      const tokenId = `${collectionUri}-${nftUri}`;
      const url = `https://rednotice.run/api/nft/token/${tokenId}.json`;
      console.log(url);

      const minitedList = await getCollectionList(erc721address);
      console.log(minitedList);
      console.log(url);
      const found = minitedList.find(item => item.uri === url);
      if (found) {
        const id = found.id;
        try {
          const updateUrl = `${ROOT_URL}/api/nft/update-token-id/${item.id}`;
          await axios.post(updateUrl, { tokenId: id });
          console.log(`Updated tokenId for NFT with ID: ${item.id}`);
        } catch (updateError) {
          console.error(`Failed to update tokenId for NFT with ID: ${item.id}`, updateError);
        }

        console.log("Already minted");
        continue;
      }

      const tx = await NFT.safeMint(
        ownerAddr,
        url
      );
      const txRes = await tx.wait();


      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const logs = receipt.logs;
      const event = NFT.interface.parseLog(logs[0]);
      const receivedTokenId = event.args.tokenId.toString();
      console.log("Received Token ID:", receivedTokenId);
      console.log(`Minted NFT with name: ${nftName}`);

      const updateUrl = `${ROOT_URL}/api/nft/update-token-id/${item.id}`;
      try {
        await axios.post(updateUrl, { tokenId: receivedTokenId });
        console.log(`Updated tokenId for NFT with ID: ${item.id}`);
      } catch (updateError) {
        console.error(`Failed to update tokenId for NFT with ID: ${item.id}`, updateError);
      }

      // process.exit(1);

    }

    console.log("All NFTs minted successfully.");


  } catch (error) {
    console.error("Error fetching JSON:", error);
  }

  /*const collectionName = "ASHEN STRIKING PRISON FORSAKEN SORROW";
  const nftNames = [
    "BETRAYER FATAL",
    "BURGLARY EXILE SENTENCE",
    "COVERT CORRUPTED",
    "GALLOW PERJURY COLD",
    "INCARCERATION SINISTER AVENGER",
    "NEFARIOUS DEATHBOUND",
    "SHADOW RUTHLESS",
    "SNITCH SHACKLES",
    "TERRIBLE FELONY",
    "TWISTED SCYTHE RAVEN KILLER",
  ];

  const accounts = await hre.ethers.getSigners();
  const account = accounts[0];
  const ownerAddr = "0xA1Fe3F1e668e1F0BdD1818b8859C34Eea3BaC467";//account.address;

  const erc721address = "0xcb781D1aC34BF801cEC9231Ba33e7DB638dE9ee8";

  const NFT = await ethers.getContractAt("RncToken", erc721address, account);
  for (let name of nftNames) {
    const collectionUri = collectionName.replace(/\s+/g, "_").toUpperCase();
    const nftUri = name.replace(/\s+/g, "_").toUpperCase();
    const tokenId = `${collectionUri}-${nftUri}`;
    const url = `https://rednotice.run/api/nft/token/${tokenId}.json`;
    console.log(url);
    const tx = await NFT.safeMint(
      ownerAddr,
      `https://rednotice.run/api/nft/token/${tokenId}.json`
    );
    await tx.wait();
    console.log(`Minted NFT with name: ${name}`);
  }

  // console.log(accounts.map(account => account.address));
  // console.log("Deploying your contract, please Wait...");
  // const NFT = await ethers.deployContract("RncToken");

  // await NFT.waitForDeployment();
  // console.log("NFT Contract deployed to:", NFT.target);
  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
