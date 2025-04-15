
const { ethers } = require("hardhat");
async function main() {

    const collectionAddr = "0xcb781d1ac34bf801cec9231ba33e7db638de9ee8";

    const accounts = await hre.ethers.getSigners();
    const account = accounts[0];

    const erc721address = collectionAddr;
    const NFT = await ethers.getContractAt("RncToken", erc721address, account);

    const maxTokenId = 11;
    const tokenIds = [];

    for (let i = 0; i < maxTokenId; i++) {
        try {
            const tokenId = await NFT.tokenURI(i);
            tokenIds.push(tokenId.toString());
        } catch (e) {
            console.log("Error fetching token ID:", e);
            break;

        }
    }

    console.log("Accessible Token IDs:", tokenIds);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
