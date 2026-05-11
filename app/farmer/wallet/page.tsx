"use client";

import { useState } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CreditCard, 
  Plus, 
  Minus, 
  History, 
  Building, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Bell
} from "lucide-react";
import FarmerNavbar from "@/app/components/FarmerNavbar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for chart
const chartData = [
  { name: 'Mon', earnings: 1200 },
  { name: 'Tue', earnings: 2100 },
  { name: 'Wed', earnings: 800 },
  { name: 'Thu', earnings: 1600 },
  { name: 'Fri', earnings: 900 },
  { name: 'Sat', earnings: 2400 },
  { name: 'Sun', earnings: 5240 },
];

export default function FarmerWalletPage() {
  const [filter, setFilter] = useState("all");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  
  // States for withdrawal flow
  const [withdrawStatus, setWithdrawStatus] = useState<"None" | "Pending" | "Approved" | "Rejected">("None");
  
  // State to toggle history visibility
  const [showHistory, setShowHistory] = useState(false);

  const transactions = [
    { id: "1", type: "credit", title: "Order #1024 Payment", date: "2026-05-10 14:30", amount: 2450, status: "completed" },
    { id: "2", type: "debit", title: "Withdrawal to Bank", date: "2026-05-09 10:15", amount: 1500, status: "completed" },
    { id: "3", type: "credit", title: "Order #1018 Payment", date: "2026-05-08 18:45", amount: 1200, status: "completed" },
    { id: "4", type: "credit", title: "Order #1015 Payment", date: "2026-05-07 09:20", amount: 800, status: "completed" },
    { id: "5", type: "debit", title: "Platform Fee", date: "2026-05-05 12:00", amount: 50, status: "completed" },
  ];

  const pendingPayments = [
    { id: "123", amount: 800, status: "Pending", expectedDate: "2026-05-12" },
    { id: "124", amount: 1200, status: "Pending", expectedDate: "2026-05-13" },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <FarmerNavbar />
      
      <div className="p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header with Notification */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <h1 className="text-3xl font-black text-slate-900">My Wallet</h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                Manage your earnings and withdrawals
                <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Last updated just now
                </span>
              </p>
            </div>
            <button className="relative p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all group">
              <Bell size={24} className="text-slate-600 group-hover:text-green-600 transition-colors" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Wallet & Chart */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Wallet Card (Hero Section) */}
              <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white rounded-[2.5rem] p-8 shadow-xl shadow-green-900/10 relative overflow-hidden group">
                {/* Background Shimmer Effect */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:-translate-x-full ease-in-out"></div>
                
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-green-100 font-medium tracking-wide text-sm uppercase">Total Earnings</p>
                      <h2 className="text-5xl font-black mt-2 flex items-baseline">
                        ₹5,240
                        <span className="text-green-200 text-sm font-medium ml-2">+₹1,200 this week</span>
                      </h2>
                    </div>
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                      <Wallet size={32} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={20} className="text-green-200" />
                      <span className="text-green-100 text-sm font-medium">Secure Wallet</span>
                    </div>
                    
                    {/* Status Line */}
                    <div className="flex items-center gap-2">
                      {withdrawStatus === "Approved" ? (
                        <span className="flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          Withdraw available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs bg-white/10 px-3 py-1 rounded-full font-bold text-green-100">
                          <Clock size={12} />
                          Withdraw locked (Admin approval required)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all group ${
                    showHistory ? "bg-purple-50 border-purple-200" : "bg-slate-50 border-transparent hover:bg-purple-50 hover:border-purple-200"
                  }`}
                >
                  <div className={`p-3 rounded-xl shadow-sm transition-all ${
                    showHistory ? "bg-purple-600 text-white" : "bg-white text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
                  }`}>
                    <History size={20} />
                  </div>
                  <span className={`text-sm font-bold ${
                    showHistory ? "text-purple-700" : "text-slate-700 group-hover:text-purple-700"
                  }`}>History</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all group">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <Building size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-orange-700">Bank Details</span>
                </button>
              </div>

              {/* Earnings Chart */}
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <TrendingUp className="text-green-600" size={24} />
                    Earnings Growth
                  </h3>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Weekly View</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                      />
                      <Area type="monotone" dataKey="earnings" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Transaction History (Conditional Render) */}
              {showHistory && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-fade-up">
                  <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <History className="text-slate-600" size={24} />
                      Recent Transactions
                    </h3>
                    
                    {/* Filters */}
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      {["all", "credit", "debit"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                            filter === f
                              ? "bg-white text-green-600 shadow-sm border border-slate-100"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {filteredTransactions.map((tx) => (
                      <div key={tx.id} className="p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${
                            tx.type === "credit" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          }`}>
                            {tx.type === "credit" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{tx.title}</p>
                            <p className="text-xs text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                              <Clock size={12} />
                              {tx.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-lg ${
                            tx.type === "credit" ? "text-green-600" : "text-red-600"
                          }`}>
                            {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                          </p>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Pending & Withdraw */}
            <div className="space-y-6">
              
              {/* Pending Payments Section */}
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Clock className="text-orange-500" size={24} />
                  Payments to be received
                </h3>
                <div className="space-y-4">
                  {pendingPayments.map((payment) => (
                    <div key={payment.id} className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Order #{payment.id}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Exp: {payment.expectedDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-orange-600">₹{payment.amount}</p>
                        <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-100 px-2 py-0.5 rounded-md text-[10px]">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Withdraw Panel */}
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <CreditCard className="text-green-600" size={24} />
                  Withdraw Funds
                </h3>
                
                {/* Status Indicator */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-700">Status:</span>
                  {withdrawStatus === "None" && (
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">No Request</span>
                  )}
                  {withdrawStatus === "Pending" && (
                    <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-100 px-3 py-1 rounded-full">Pending Approval</span>
                  )}
                  {withdrawStatus === "Approved" && (
                    <span className="text-xs font-black uppercase tracking-widest text-green-500 bg-green-100 px-3 py-1 rounded-full">Approved</span>
                  )}
                  {withdrawStatus === "Rejected" && (
                    <span className="text-xs font-black uppercase tracking-widest text-red-500 bg-red-100 px-3 py-1 rounded-full">Rejected</span>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-xs text-blue-700 mb-4">
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  <p className="font-medium">
                    Withdrawals are enabled only after admin approval for security and verification.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Enter Amount</label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-bold">₹</span>
                      </div>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="block w-full rounded-2xl border-slate-200 pl-10 pr-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                        placeholder="0.00"
                        disabled={withdrawStatus !== "Approved" && withdrawStatus !== "None"}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Select Bank Account</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="block w-full rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                      disabled={withdrawStatus !== "Approved" && withdrawStatus !== "None"}
                    >
                      <option value="">Choose Bank</option>
                      <option value="sbi">State Bank of India (**** 4321)</option>
                      <option value="hdfc">HDFC Bank (**** 8765)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    onClick={() => {
                      if (withdrawStatus === "None") {
                        setWithdrawStatus("Pending");
                      } else if (withdrawStatus === "Approved") {
                        alert("Withdrawal Successful!");
                      }
                    }}
                    disabled={withdrawStatus === "Pending" || withdrawStatus === "Rejected"}
                    className={`w-full flex justify-center items-center gap-3 py-4 px-8 border border-transparent rounded-2xl shadow-lg text-base font-black text-white transition-all hover:-translate-y-0.5 active:scale-95 ${
                      withdrawStatus === "None" ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400" :
                      withdrawStatus === "Approved" ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400" :
                      "bg-slate-400 cursor-not-allowed opacity-70"
                    }`}
                  >
                    {withdrawStatus === "None" && (
                      <>
                        <ArrowUpRight size={20} />
                        Request Withdrawal
                      </>
                    )}
                    {withdrawStatus === "Pending" && (
                      <>
                        <Clock size={20} />
                        Waiting for admin approval
                      </>
                    )}
                    {withdrawStatus === "Approved" && (
                      <>
                        <CheckCircle size={20} />
                        Withdraw Now
                      </>
                    )}
                    {withdrawStatus === "Rejected" && (
                      <>
                        <AlertTriangle size={20} />
                        Withdrawal Rejected
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-2 justify-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                    <ShieldCheck size={14} />
                    Secure Bank Transfer
                  </div>
                </form>
              </div>

              {/* Low Balance Warning (Conditional Example) */}
              <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-5 flex gap-4">
                <div className="text-amber-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Minimum Balance Notice</h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Maintain a minimum balance of ₹100 to keep your wallet active for future orders.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
