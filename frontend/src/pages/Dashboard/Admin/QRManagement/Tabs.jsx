import React, { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

<div className="space-y-4">
  <div className="flex space-x-4 border-b border-gray-300 mb-4">
    <button
      onClick={() => setActiveTab("cashBack")}
      className={`py-2 px-4 ${
        activeTab === "cashBack"
          ? "border-b-2 border-blue-500 text-blue-500"
          : "text-gray-500"
      }`}
    >
      Cash Back
    </button>
    <button
      onClick={() => setActiveTab("additionalFee")}
      className={`py-2 px-4 ${
        activeTab === "additionalFee"
          ? "border-b-2 border-blue-500 text-blue-500"
          : "text-gray-500"
      }`}
    >
      Additional Fee
    </button>
  </div>

  {/* Cash Back Form */}
  {activeTab === "cashBack" && (
    <form onSubmit={addCashBack} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cash Back Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Update Balance
      </button>
    </form>
  )}

  {/* Additional Fee Form */}
  {activeTab === "additionalFee" && (
    <form onSubmit={addAdditionalPrice} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Fee Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Update Balance
      </button>
    </form>
  )}
</div>;
