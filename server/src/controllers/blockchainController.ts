import { Request, Response } from "express";
import { Blockchain, Transaction } from "../blockchain/blockchain.js";
import TransactionModel from "../models/transactionModel.js";

const blockChargeBlockchain = new Blockchain();

export const addTransaction = async (req: Request, res: Response) => {
  try {
    const { from, to, data } = req.body;

    if (!from || !to || !data) {
      return res.status(400).json({ message: "Invalid transaction data" });
    }

    const transaction: Transaction = {
      from,
      to,
      data,
      timestamp: Date.now(),
    };

    blockChargeBlockchain.addBlock([transaction]);

    const newBlock = blockChargeBlockchain.getLatestBlock();

    const savedTransaction = await new TransactionModel({
      ...transaction,
      blockIndex: newBlock.index,
    }).save();

    return res.status(201).json({
      message: "Transaction added and block created successfully",
      block: newBlock,
      transaction: savedTransaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const validateBlockchain = (req: Request, res: Response) => {
  const isValid = blockChargeBlockchain.isChainValid();
  return res.status(200).json({ isValid });
};
