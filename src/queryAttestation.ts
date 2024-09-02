
import axios from "axios";
import { ethers } from "ethers";
const {
    SignProtocolClient,
    SpMode,
    EvmChains,
    IndexService
} = require('@ethsign/sp-sdk');
// Generate a function for making requests to the Sign Protocol Indexing Service
async function makeAttestationRequest(endpoint: string, options: any) {
  const url = `https://testnet-rpc.sign.global/api/${endpoint}`;
  const res = await axios.request({
    url,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  });
  // Throw API errors
  if (res.status !== 200) {
    throw new Error(JSON.stringify(res));
  }
  // Return original response
  return res.data;
}


async function queryAttestations(indexingValue:string) {
    const response = await makeAttestationRequest("index/attestations", {
      method: "GET", 
      params: {
        mode: "onchain", // Data storage location
        schemaId: "onchain_evm_84532_0x151", // Your full schema's ID
        attester: "0x4f5c387121663F747E2644D32de472eD884A2cb2", // Alice's address
        indexingValue: indexingValue, // Bob's address
      },
    });
  
    // Make sure the request was successfully processed.
    console.log("response====== ", response)
    if (!response.success) {
      return {
        success: false,
        message: response?.message ?? "Attestation query failed.",
      };
    }
  
    // Return a message if no attestations are found.
    if (response.data?.total === 0) {
      return {
        success: false,
        message: "No attestation for this address found.",
      };
    }
  
    // Return all attestations that match our query.
    return {
      success: true,
      attestations: response.data.rows,
    };
  }

async function queryAttestation1(indexingValue:string) {
    const indexService = new IndexService('testnet'); // testnet or mainnet

    // retreives all attestations based on the query parameter
    const attestations = await indexService.queryAttestationList( {
        indexingValue
    });
    console.log("attesntations----- ", attestations)

    console.log("schema----- ", attestations.rows[0].schema)
    console.log("recipients----- ", attestations.rows[0].recipients)
    // return {"schemma" : attestations.rows[0].schema, "recipients": attestations.rows[0].recipients}
    // get attestation using the an ID
    // const res = await indexService.queryAttestation(attestationId);
    // const encodedData = res.data

    // // if you need to decode the data for your use case
    let decodedData = ethers.utils.AbiCoder.decode([ "uint", "string" ], data);
}  

// queryAttestations("ax@gmail.com0x4f5c387121663F747E2644D32de472eD884A2cb2".toLocaleLowerCase()).then( async (resp)=>{

//     console.log("queryAttestation response: ", await resp)
// })

queryAttestation1("ax@gmail.com0x4f5c387121663F747E2644D32de472eD884A2cb2").then( async (resp)=>{

  console.log("queryAttestation response: ", await resp)
})

