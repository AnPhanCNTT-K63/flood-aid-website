import React from "react";
import { useState } from "react";
import { checkout } from "../../apis/services/PaymentService";
import { Link } from "react-router-dom";

export default function DonatePanel() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [loading, setLoading] = useState(false);

  const exchangeRate = 24000;

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleCheckout = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const amountInUSD =
        currency === "vnd"
          ? parseFloat((parseFloat(amount) / exchangeRate).toFixed(2))
          : parseFloat(parseFloat(amount).toFixed(2));

      const res = await checkout({
        amount: amountInUSD,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format displayed amount based on currency
  const getDisplayAmount = () => {
    if (!amount) return "";

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "";

    if (currency === "usd") {
      return `$${numAmount.toFixed(2)}`;
    } else {
      return `₫${numAmount.toLocaleString()} (≈ $${(
        numAmount / exchangeRate
      ).toFixed(2)})`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Make a Donation</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Money Donation */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Donate Money
          </h2>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Select Currency</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="currency"
                  value="usd"
                  checked={currency === "usd"}
                  onChange={handleCurrencyChange}
                  className="mr-2"
                />
                USD ($)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="currency"
                  value="vnd"
                  checked={currency === "vnd"}
                  onChange={handleCurrencyChange}
                  className="mr-2"
                />
                VND (₫)
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Donation Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-3">
                {currency === "usd" ? "$" : "₫"}
              </span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder={currency === "usd" ? "50.00" : "1,000,000"}
                className="w-full p-3 pl-7 border rounded-md"
              />
            </div>
            {amount && parseFloat(amount) > 0 && (
              <p className="mt-2 text-gray-600">
                You will donate: {getDisplayAmount()}
              </p>
            )}
          </div>

          <div className="mb-6">
            <button
              onClick={handleCheckout}
              disabled={
                loading ||
                !amount ||
                isNaN(parseFloat(amount)) ||
                parseFloat(amount) <= 0
              }
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Processing..." : `Donate Now`}
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Payments processed securely via Stripe
          </p>
        </div>

        {/* Items Donation */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Donate Items
          </h2>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Have items you'd like to donate? We accept various goods such as:
            </p>

            <ul className="list-disc pl-5 mb-6 text-gray-600">
              <li>Clothing and shoes</li>
              <li>Household items</li>
              <li>Furniture</li>
              <li>Electronics</li>
              <li>Books and toys</li>
              <li>Non-perishable food</li>
            </ul>

            <p className="text-gray-600 mb-6">
              Your donated items will be distributed to those in need or sold to
              fund our charitable activities.
            </p>
          </div>

          <div className="mb-6">
            <Link
              to="/donate/items"
              className="block w-full bg-green-600 text-white text-center py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              Donate Items
            </Link>
          </div>

          <p className="text-sm text-gray-500 text-center">
            We'll arrange pickup for your donated items
          </p>
        </div>
      </div>
    </div>
  );
}
