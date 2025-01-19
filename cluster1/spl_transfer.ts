import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("AjzjHGkmZpXLwCmdbkVwMyFYM9He29x47yT8DDwbda26");

// Recipient address
const to = new PublicKey("5N5G7Wt2pumePRNjkfj9BbU8LrAdW4RjswXwNGYx15CM");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint,keypair.publicKey);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const ata2 = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(connection, keypair, ata.address, ata2.address, keypair, 1e6);

        console.log(`Transaction signature: ${tx}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
        
    }
})();