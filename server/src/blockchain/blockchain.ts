import crypto from "crypto";

interface Transaction {
  from: string; // e.g., User ID
  to: string; // e.g., Charging Station ID
  data: string; // e.g., Encrypted check-in data or essential user data
  timestamp: number;
}

interface Validator {
  address: string; // e.g., User ID or validator identifier
  stake: number; // The amount staked
}

class Block {
  public index: number;
  public timestamp: number;
  public transactions: Transaction[];
  public previousHash: string;
  public hash: string;
  public validator: string; // Validator address who validated this block
  private nonce: number;

  constructor(
    index: number,
    transactions: Transaction[],
    previousHash: string = "",
    validator: string = ""
  ) {
    this.index = index;
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.validator = validator;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          JSON.stringify(this.transactions) +
          this.nonce +
          this.validator
      )
      .digest("hex");
  }

  hasValidTransactions(): boolean {
    // Placeholder for transaction validation logic
    return true;
  }
}

class Blockchain {
  public chain: Block[];
  public validators: Validator[];
  private minimumStake: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.validators = [];
    this.minimumStake = 10;
  }

  createGenesisBlock(): Block {
    return new Block(0, [], "0", "genesis-validator");
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  registerValidator(address: string, stake: number): void {
    if (stake >= this.minimumStake) {
      this.validators.push({ address, stake });
      console.log(`Validator ${address} registered with a stake of ${stake}`);
    } else {
      console.error("Stake too low to become a validator.");
    }
  }

  chooseValidator(): Validator | null {
    if (this.validators.length === 0) return null;

    const totalStake = this.validators.reduce(
      (sum, validator) => sum + validator.stake,
      0
    );
    const randomValue = Math.random() * totalStake;
    let stakeSum = 0;

    for (const validator of this.validators) {
      stakeSum += validator.stake;
      if (randomValue <= stakeSum) {
        return validator;
      }
    }

    return null;
  }

  addBlock(transactions: Transaction[]): void {
    const chosenValidator = this.chooseValidator();
    if (!chosenValidator) {
      console.error("No validators available to validate the block.");
      return;
    }

    const newBlock = new Block(
      this.chain.length,
      transactions,
      this.getLatestBlock().hash,
      chosenValidator.address
    );

    if (this.isBlockValid(newBlock)) {
      this.chain.push(newBlock);
      console.log(
        `Block added by validator ${chosenValidator.address}:`,
        newBlock
      );
      chosenValidator.stake += 1;
    } else {
      console.error("New block is invalid. Validation failed.");
      chosenValidator.stake -= 1;
      if (chosenValidator.stake < this.minimumStake) {
        this.validators = this.validators.filter(
          (v) => v.address !== chosenValidator.address
        );
        console.log(
          `Validator ${chosenValidator.address} removed due to low stake.`
        );
      }
    }
  }

  isBlockValid(block: Block): boolean {
    const lastBlock = this.getLatestBlock();

    if (block.previousHash !== lastBlock.hash) {
      console.error("Previous hash does not match.");
      return false;
    }

    if (block.hash !== block.calculateHash()) {
      console.error("Block hash is invalid.");
      return false;
    }

    if (!block.hasValidTransactions()) {
      console.error("Block contains invalid transactions.");
      return false;
    }

    return true;
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }
    }

    return true;
  }
}

export function encryptData(data: string, secretKey: string): string {
  const algorithm = "aes-256-ctr";
  const iv = crypto.randomBytes(16); // Initialization vector

  const cipher = crypto.createCipheriv(
    algorithm,
    crypto.scryptSync(secretKey, "salt", 32),
    iv
  );
  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptData(encryptedData: string, secretKey: string): string {
  const [ivHex, encryptedHex] = encryptedData.split(":");
  const algorithm = "aes-256-ctr";
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    crypto.scryptSync(secretKey, "salt", 32),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export { Block, Blockchain, Transaction, Validator };
