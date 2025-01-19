import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("AjzjHGkmZpXLwCmdbkVwMyFYM9He29x47yT8DDwbda26");

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
//eddsa is an interface which manages all pubkey and privkeys and redefines them
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
         let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer, 

             
         }

         let data: DataV2Args = {
            name: "novoyd",
            symbol: "ns",
            // empty string over here check why
            uri: "",
            sellerFeeBasisPoints:1000,
            creators: null, 
            collection: null,
            // uses is for pnft so null as well
            uses: null
         }

         let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null
         }
//check this 
        let tx = createMetadataAccountV3(
             umi,
             {
                 ...accounts,
                 ...args
             }
         )

         let result = await tx.sendAndConfirm(umi);
         console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
