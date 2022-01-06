import { pinJSONToIPFS } from "./pinata.js";
import detectEthereumProvider from "@metamask/detect-provider";
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require("../contract-abi.json");
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const connectWallet = async () => {
  const isMobile = window.innerWidth <= 479;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleEthereum = async () => {
    const { ethereum } = window;
    if (ethereum) {
      return ethereum
        .request({ method: "eth_requestAccounts" })
        .then((addressArray) => {
          return {
            status: "👆🏽 Wallet already connected.",
            address: addressArray[0],
          };
        })
        .catch((err) => {
          return {
            address: "",
            status: "😥 " + err.message,
          };
        });
    } else {
      return Promise.resolve({
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      });
    }
  };

  if (isMobile === false) {
    return handleEthereum();
  } else {
    if (window.ethereum) {
      return handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });
      window.location.assign(
        "https://metamask.app.link/dapp/hapebeastnft.co/index.html"
      );
      return wait(3 * 1000).then(() => handleEthereum());
    }
  }
};

export const getCurrentWalletConnected = async () => {
  const provider = await detectEthereumProvider();
  if (provider) {
    try {
      const addressArray = await provider.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 MINT 3 GET 3 FREE",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

async function loadContract() {
  return new web3.eth.Contract(contractABI, contractAddress);
}
