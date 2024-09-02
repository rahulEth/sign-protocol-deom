const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");
require('dotenv').config()

const privateKey = process.env.METAMASK_PRIVATE_KEY;
console.log('privateKey---- ', privateKey)
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia,
  account: privateKeyToAccount(privateKey), // Optional, depending on environment
});


// creating an schema
const createSchema = async ()=>{

    const resp = await client.createSchema({
        name: "trustless-pass-demo",
        data: [
            {"name":"username","type":"string"}, //emailId or userId
            {"name":"password","type":"string"},
            {"name":"appLink","type":"string"}, // amazon.com, chainlink.com
            { "name": "type", "type": "string"},  //banking, personal, social
            { "name": "signer", "type": "address"}, 
            {"name":"metadata","type":"string"},
            {"name":"timestamp","type":"string"}
            
        ]
            
    })
    
    console.log("resp------  ", resp)
}

// createSchema()


//   {
//     schemaId: '0x151',
//     txHash: '0x4b70ce39b1f72ed885dea92072967dbfdc4055126032ba8b228a899297085609'
//   }


const [PDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("data"), user.publicKey.toBuffer()],
    program.programId,
   );
   
   
   it("Is initialized!", async () => {
    const transactionSignature = await program.methods
      .initialize()
      .accounts({
        user: user.publicKey,
        pdaAccount: PDA,
      })
      .rpc();
    console.log("Transaction Signature:", transactionSignature);
   });
   it("Fetch Account", async () => {
    const pdaAccount = await program.account.dataAccount.fetch(PDA);
    console.log(JSON.stringify(pdaAccount, null, 2));
   });
