import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract, ethers } from "ethers";

const {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService
} = require('@ethsign/sp-sdk');

const { privateKeyToAccount } = require('viem/accounts');


import ISPABI from '../ISPABI.json';
require('dotenv').config();
console.log(' ISPABI.abi',  ISPABI.abi)
async function createNotaryAttestation(username:string, password: string, appLink: string, type:string, signer: string, metadata: string, timestamp: string) {
  let address = "0x4f5c387121663F747E2644D32de472eD884A2cb2"; // Alice's address. Will need Alice's account to send the tx.
  let schemaData 
  try{
    schemaData = ethers.utils.defaultAbiCoder.encode(
      ["string","string","string","string", "address","string","string"],
      [username, password, appLink, type, signer, metadata, timestamp]
    );
    
  }catch(err){

  }
  // Standard setup for the contract
    
  console.log('process.env.BASE_SEPOLIA----- ', process.env.BASE_SEPOLIA)
  const provider = new ethers.providers.JsonRpcProvider(
    // Get an RPC URL (such as an infura link) to connect to the network
    process.env.BASE_SEPOLIA
  );
  // Get the contract address from the Address Book in docs.sign.global
  const contract = new Contract('0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD', ISPABI.abi, provider);
  console.log('contract instance----- ', contract)
  // Get the provider from the currently connected wallet
  const priv:any = process.env.METAMASK_PRIVATE_KEY?.toString()
  console.log('priv----- ', priv)
  const wallet = new ethers.Wallet(priv, provider);
  console.log('wallet....... ', wallet)
  // Create writable contract instance
  const instance = contract.connect(wallet as any) as Contract;
  console.log("index value : ", username+signer)
  // Send the attestation transaction
  try {
    await instance[
      "attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes)"
    ](
      {
        schemaId: BigNumber.from("0x151"), // The final number from our schema's ID.
        linkedAttestationId: 0, // We are not linking an attestation.
        attestTimestamp: 0, // Will be generated for us.
        revokeTimestamp: 0, // Attestation is not revoked.
        attester: address, // Alice's address.
        validUntil: 0, // We are not setting an expiry date.
        dataLocation: 0, // We are placing data on-chain.
        revoked: false, // The attestation is not revoked.
        recipients: [signer], // Bob is our recipient.
        data: schemaData, // The encoded schema data.
        indexingValue: username+signer
      },
      signer.toLowerCase(), // Bob's lowercase address will be our indexing key.
      "0x", // No delegate signature.
      "0x00" // No extra data.
    )
      .then(
        async (tx: any) =>
          await tx.wait(1).then((res:any) => {
            console.log("success", res);
            // You can find the attestation's ID using the following path:
            console.log("attenstationId======= ", res.events[0].args.attestationId)
          })
      )
      .catch((err: any) => {
        console.log(err?.message ? err.message : err);
      });
  } catch (err: any) {
    console.log(err?.message ? err.message : err);
  }
}


async function createNotaryAttestation1(username:string, password: string, appLink: string, type:string, signer: string, metadata: string, timestamp: string) {
  let address = "0x4f5c387121663F747E2644D32de472eD884A2cb2"; // Alice's address. Will need Alice's account to send the tx.
  // let schemaData 
  // try{
  //   schemaData = ethers.utils.defaultAbiCoder.encode(
  //     ["string","string","string","string", "address","string","string"],
  //     [username, password, appLink, type, signer, metadata, timestamp]
  //   );
    
  // }catch(err){

  // }
  // Standard setup for the contract
    
  console.log('process.env.BASE_SEPOLIA----- ', process.env.BASE_SEPOLIA)
      // Add "0x" to the start of your private key if it's not already there
      const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY1; 
      const account = privateKeyToAccount(PRIVATE_KEY);
  
      const client = new SignProtocolClient(SpMode.OnChain, {
          // pass in the same network you registered your schema on
          chain: EvmChains['baseSepolia'], // or sepolia
          account
      });
  
  console.log("index value : ", username+signer)
  // Send the attestation transaction
  const schemaData = {username: username, password: password, appLink: password, type: type, signer: signer, metadata: metadata, timestamp: timestamp};

  try {
    const tx = await client.createAttestation({
        schemaId: "0x151", // the schema id
        data: schemaData,
        indexingValue: username+signer, // indexing value. Hint: use a unique property from your schema
        recipients: [signer], // The signer's address.
    });
    console.log("transaction Hash:----- ", tx)
  } catch (error) {
      throw error
  }
}
// createNotaryAttestation("ax@gmail.com", "1234", "amazon.com", "social", "0x4f5c387121663F747E2644D32de472eD884A2cb2", 'no metadata', '153455666666')

createNotaryAttestation1("ax@gmail.com", "1234", "amazon.com", "social", "0x4f5c387121663F747E2644D32de472eD884A2cb2", 'no metadata', '153455666666')
