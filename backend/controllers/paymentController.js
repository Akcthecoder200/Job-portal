import { ethers } from "ethers";

import dotenv from "dotenv";
import Job from "../models/jobModel.js";
dotenv.config();

const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS;

const PLATFORM_FEE_ETH = process.env.PLATFORM_FEE_ETH;

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;

const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

export const confirmPayment = async (req, res) => {
  const { jobId, transactionHash } = req.body;

  if (!jobId || !transactionHash) {
    return res
      .status(400)
      .json({ message: "Missing jobId or transactionHash." });
  }

  try {
    // 1. Get the transaction receipt from the blockchain
    const transaction = await provider.getTransaction(transactionHash);
    const receipt = await provider.getTransactionReceipt(transactionHash);

    // 2. Validate the transaction
    if (!transaction || !receipt || receipt.status !== 1) {
      return res.status(400).json({
        message: "Transaction failed or not found on the blockchain.",
      });
    }

    // Convert the platform fee to Wei for comparison
    const expectedFeeWei = ethers.parseEther(PLATFORM_FEE_ETH);

    // 3. Verify the transaction details
    const paidAmount = transaction.value;
    const toAddress = transaction.to;

    if (toAddress.toLowerCase() !== ADMIN_WALLET_ADDRESS.toLowerCase()) {
      return res.status(400).json({
        message: "Transaction was not sent to the correct admin wallet.",
      });
    }

    if (paidAmount.toString() !== expectedFeeWei.toString()) {
      return res
        .status(400)
        .json({ message: "Incorrect amount paid for the platform fee." });
    }

    // 4. Update the job in the database
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { paymentConfirmed: true },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found in database." });
    }

    // 5. Respond with success
    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully, and job is now live!",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res
      .status(500)
      .json({ message: "Server error during payment confirmation." });
  }
};
