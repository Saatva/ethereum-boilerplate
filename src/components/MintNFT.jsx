import React, { useRef, useState } from "react";
import { Card, Typography, Input, Button, Modal } from "antd";
import AddressInput from "./AddressInput";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import ResumeImageGenerator from "./ResumeImageGenerator/ResumeImageGenerator";
// import saatvaLogo from "./ResumeImageGenerator/assets/saatva-logo-letter.jpeg";

const { Text } = Typography;

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
    width: "50%",
  },
  timeline: {
    marginBottom: "-45px",
  },
};

export default function MintNFT() {
  const { Moralis } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [receiver, setReceiver] = useState();
  const [title, setTitle] = useState();
  const [company, setCompany] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [file, setFile] = useState();
  // const [modalVisible, setModalVisible] = useState();
  // const [modalTitle, setModalTitle] = useState();
  // const [modalDescription, setModalDescription] = useState();

  const imageRef = useRef(null);

  const handleSubmit = async () => {
    console.log(imageRef.current.src);
    if (receiver && company && startDate && endDate && title && file) {
      const moralisFile = new Moralis.File("companylogo.jpg", {
        base64: imageRef.current.src,
      });
      await moralisFile.saveIPFS();

      const metadata = {
        image: moralisFile.ipfs(),
        start_date: startDate,
        end_date: endDate,
        company: company,
        title: title,
      };
      const metadataFile = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(metadata)),
      });
      await metadataFile.saveIPFS();

      const options = {
        contractAddress: "0x80Fe0cf72Ab51e08C98132E4350a72833bcC4e66",
        functionName: "mintNFT",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "recipient",
                type: "address",
              },
              {
                internalType: "string",
                name: "tokenURI",
                type: "string",
              },
            ],
            name: "mintNFT",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        params: {
          recipient: receiver,
          tokenURI: metadataFile.ipfs(),
        },
      };
      contractProcessor.fetch({
        params: options,
        onSuccess: (e) => {
          Modal.success({
            title: "Success!! NFT minted",
            content: (
              <>
                <p>
                  The transaction will take around 30 seconds to be completed
                  then you will see the NFT in your wallet.
                </p>
                <a
                  href={`https://rinkeby.etherscan.io/tx/${e.hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View status on etherscan
                </a>
              </>
            ),
          });
          // setModalTitle("");
          // setModalVisible(true);
        },
        onError: (e) => {
          Modal.error({
            title: "NFT minting failed",
            content: (
              <>
                <p>We are experiencing technical difficulties:</p>
                <p style={{ color: "red" }}>
                  <em>{e.error.message}</em>
                </p>
              </>
            ),
          });
        },
      });
    } else {
      Modal.warning({
        title: "You're not done",
        content: "Don't be lazy, fill in the form",
      });
    }
  };

  return (
    <>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Add work experience</Text>
          </>
        }
      >
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>Address:</Text>
          </div>
          <AddressInput autoFocus onChange={setReceiver} />
        </div>
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>Company:</Text>
          </div>
          <Input size="large" onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>Title:</Text>
          </div>
          <Input size="large" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>Start Date:</Text>
          </div>
          <Input
            type="date"
            size="large"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>End Date:</Text>
          </div>
          <Input
            type="date"
            size="large"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>File input:</Text>
          </div>
          <Input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
              console.log(e);
            }}
          />
        </div>
        <ResumeImageGenerator
          title={title}
          startDate={startDate}
          endDate={endDate}
          logoImage={file}
          imageId="nft-preview"
          ref={imageRef}
          imageStyle={{ margin: "20px auto 0", border: "1px solid #ddd" }}
        />
        <Button
          type="primary"
          size="large"
          // loading={isPending}
          style={{ width: "100%", marginTop: "25px" }}
          onClick={handleSubmit}
          // disabled={!tx}
        >
          Mint Badge Experience💸
        </Button>
      </Card>
      {/* <Modal.info
        title={modalTitle}
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
      >
        <div>{modalDescription}</div>
      </Modal.info> */}
    </>
  );
}
