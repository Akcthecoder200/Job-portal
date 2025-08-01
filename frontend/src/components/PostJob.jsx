import React, { useContext, useEffect, useState } from "react";
import {
  Plus,
  X,
  DollarSign,
  MapPin,
  FileText,
  Tag,
  Briefcase,
  ArrowRight,
  Wallet,
  Loader,
  CheckCircle,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { AuthContext } from "../context/context.jsx";

const PostJobComponent = () => {
  const { handleLogout } = useContext(AuthContext);

  // Step management: 1 = Payment, 2 = Job Form
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    budgetOrSalary: "",
    location: "",
    tags: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Blockchain payment states
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [balance, setBalance] = useState("0");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [transactionHash, setTransactionHash] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api/jobs";

  const ADMIN_WALLETS = {
    ethereum: "0x17871d1863412FfAf073552859Af52bF501Caf4D",
  };

  // Platform fees - PER POST
  const PLATFORM_FEES = {
    ethereum: "0.001", // ETH per post
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setFormData((prev) => ({
        ...prev,
        posterEmail: storedEmail,
      }));
    }
    if (!token) {
      setMessage({ type: "error", text: "Not authenticated. Please log in." });
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userEmail");
      handleLogout();
    }
  }, [handleLogout]);

  // Check if wallets are available
  const checkWalletAvailability = () => {
    return {
      metamask: typeof window !== "undefined" && window.ethereum,
    };
  };

  const connectMetaMask = async () => {
    setPaymentLoading(true);
    setPaymentError("");

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];
      setWalletAddress(account);
      setWalletType("ethereum");
      setWalletConnected(true);

      // Get balance
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      });

      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(
        4
      );
      setBalance(balanceInEth);
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Process Ethereum payment
  const processEthereumPayment = async () => {
    try {
      setPaymentStatus("processing");
      setPaymentError("");

      const fee = PLATFORM_FEES.ethereum;
      const adminWallet = ADMIN_WALLETS.ethereum;
      const feeInWei = (parseFloat(fee) * Math.pow(10, 18)).toString(16);

      const transactionParameters = {
        to: adminWallet,
        from: walletAddress,
        value: `0x${feeInWei}`,
        gas: "0x5208",
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      setTransactionHash(txHash);
      await waitForTransactionConfirmation(txHash);

      setPaymentStatus("success");
      setPaymentCompleted(true);
      setPaymentDetails({
        transactionHash: txHash,
        walletAddress,
        amount: fee,
        currency: "ETH",
        network: "ethereum",
      });
      await logPaymentToBackend(paymentDetails);
    } catch (error) {
      setPaymentStatus("error");
      setPaymentError(error.message);
    }
  };

  // Wait for transaction confirmation
  const waitForTransactionConfirmation = async (txHash) => {
    return new Promise((resolve, reject) => {
      const checkTransaction = async () => {
        try {
          const receipt = await window.ethereum.request({
            method: "eth_getTransactionReceipt",
            params: [txHash],
          });

          if (receipt) {
            if (receipt.status === "0x1") {
              resolve(receipt);
            } else {
              reject(new Error("Transaction failed"));
            }
          } else {
            setTimeout(checkTransaction, 2000);
          }
        } catch (error) {
          reject(error);
        }
      };
      checkTransaction();
    });
  };

  //Log payment to backend
  const logPaymentToBackend = async (paymentData) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:5000/api/payment/confirm-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            jobId: jobId,
            transactionHash: paymentData.transactionHash,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to log payment to backend");
      }
    } catch (error) {
      console.error("Error logging payment:", error);
    }
  };

  const processPayment = async () => {
    if (walletType === "ethereum") {
      await processEthereumPayment();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(`${API_BASE_URL}/create-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          skills: formData.skills,
          budgetOrSalary: formData.budgetOrSalary,
          location: formData.location,
          tags: formData.tags,
          posterEmail: formData.posterEmail,
          paymentDetails: paymentDetails,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Job posted successfully!" });
        setJobId(data.job._id);
        // Reset form
        setFormData({
          title: "",
          description: "",
          skills: [],
          budgetOrSalary: "",
          location: "",
          tags: [],
        });
        setCurrentStep(1);
        setPaymentCompleted(false);
        setPaymentDetails(null);
        setPaymentStatus("idle");
        setTransactionHash("");
        setWalletConnected(false);
        setWalletAddress("");
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to post job",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
      console.error("Job posting error:", error);
    } finally {
      setLoading(false);
    }
  };

  const walletAvailability = checkWalletAvailability();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          <div
            className={`flex items-center ${
              currentStep >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paymentCompleted
                  ? "bg-green-600 text-white"
                  : currentStep >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {paymentCompleted ? <CheckCircle className="w-5 h-5" /> : "1"}
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div
            className={`flex items-center ${
              currentStep >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="ml-2 font-medium">Job Details</span>
          </div>
        </div>
      </div>

      {/* Step 1: Payment */}
      {currentStep === 1 && (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <Wallet className="w-12 h-12 mx-auto text-blue-600 mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Platform Fee Payment
            </h2>
            <p className="text-gray-600 mt-2">
              Pay the platform fee to post your job
            </p>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Per-Post Fee:</strong> You need to pay for each job you
                post
              </p>
            </div>
          </div>

          {paymentError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700 text-sm">{paymentError}</span>
              </div>
            </div>
          )}

          {!walletConnected ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Choose Your Wallet
              </h3>

              {/* MetaMask Connection */}
              <button
                onClick={connectMetaMask}
                disabled={!walletAvailability.metamask || paymentLoading}
                className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">MetaMask</div>
                  <div className="text-sm text-gray-600">
                    Ethereum - {PLATFORM_FEES.ethereum} ETH per post
                  </div>
                </div>
                {paymentLoading && <Loader className="w-4 h-4 animate-spin" />}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wallet Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Connected Wallet
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                  <div className="mt-1">
                    Balance: {balance}{" "}
                    {walletType === "ethereum" ? "ETH" : "SOL"}
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-800">
                    Platform Fee
                  </span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      {walletType === "ethereum"
                        ? PLATFORM_FEES.ethereum
                        : PLATFORM_FEES.solana}{" "}
                      {walletType === "ethereum" ? "ETH" : "SOL"}
                    </span>
                  </div>
                </div>

                {paymentStatus === "idle" && (
                  <button
                    onClick={processPayment}
                    disabled={paymentLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        Pay Platform Fee
                      </>
                    )}
                  </button>
                )}

                {paymentStatus === "processing" && (
                  <div className="text-center py-4">
                    <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-gray-600">Processing payment...</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Please confirm the transaction in your wallet
                    </p>
                  </div>
                )}

                {paymentStatus === "success" && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
                    <p className="text-green-600 font-semibold mb-2">
                      Payment Successful!
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      You can now post your job
                    </p>
                    {transactionHash && (
                      <a
                        href={`${
                          walletType === "ethereum"
                            ? "https://etherscan.io"
                            : "https://explorer.solana.com"
                        }/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center gap-1 mb-4"
                      >
                        View Transaction <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Continue to Job Form
                    </button>
                  </div>
                )}

                {paymentStatus === "error" && (
                  <div className="text-center py-4">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-600 mb-3" />
                    <p className="text-red-600 font-semibold mb-2">
                      Payment Failed
                    </p>
                    <button
                      onClick={() => setPaymentStatus("idle")}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Job Form (only accessible after payment) */}
      {currentStep === 2 && paymentCompleted && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Post a New Job
            </h2>
            <p className="text-gray-600 mt-2">
              Fill out the details below to post your job listing
            </p>

            {/* Payment confirmation */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 text-sm">
                  Payment confirmed: {paymentDetails?.amount}{" "}
                  {paymentDetails?.currency}
                </span>
              </div>
            </div>
          </div>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the job responsibilities, requirements, and what you're looking for..."
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. React, Node.js, Python"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Budget/Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Budget/Salary *
              </label>
              <input
                type="text"
                name="budgetOrSalary"
                value={formData.budgetOrSalary}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. $50,000 - $70,000 annually or $25/hour"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. New York, NY or Remote"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Full-time, Remote, Urgent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleSubmit}
                disabled={loading || !paymentCompleted}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Posting Job..." : "Post Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJobComponent;
