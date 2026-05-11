"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formatAddress = (addr: any, fallback: string) => {
  if (!addr) return fallback;
  if (typeof addr === 'string') return addr;
  const parts = [addr.addressLine1, addr.addressLine2, addr.city, addr.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : fallback;
};

function CartItemCard({ item, handleUpdateQuantity, handleRemove, updatingId }: any) {
  const minQty = Math.min(["vegetable", "fruit"].includes(item.productId?.category || "") ? 5 : 20, item.productId?.availableQuantityKg || 1);
  const [localQty, setLocalQty] = useState<number | string>(item.quantity);

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const onQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setLocalQty('');
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) {
      setLocalQty(Math.min(num, item.productId?.availableQuantityKg || num));
    }
  };

  const onQtyBlur = () => {
    let finalQty = typeof localQty === 'number' ? localQty : item.quantity;
    if (finalQty < minQty) finalQty = minQty;
    setLocalQty(finalQty);
    if (finalQty !== item.quantity) {
      handleUpdateQuantity(item.productId?._id, finalQty);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center">
      <div className="w-full sm:w-28 h-28 bg-slate-100 rounded-2xl overflow-hidden relative shrink-0">
        {item.productId?.imageUrl ? (
          <Image src={item.productId.imageUrl} alt={item.productId.cropName} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <ShoppingBag size={32} />
          </div>
        )}
      </div>
      
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-black text-slate-900">{item.productId?.cropName}</h3>
            <p className="text-sm font-bold text-slate-400">Sold by {item.productId?.farmerName}</p>
            <p className="text-xs font-medium text-slate-500 mt-1 max-w-xs">{formatAddress(item.productId?.farmerId?.address, item.productId?.location || item.productId?.pinCode)}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-slate-900">₹{item.productId?.pricePerKg * item.quantity}</div>
            <div className="text-xs font-bold text-slate-400">₹{item.productId?.pricePerKg}/kg</div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            <div className="relative flex items-center shrink-0 w-24 mb-1">
              <input 
                type="number" 
                min={minQty} 
                max={item.productId?.availableQuantityKg}
                value={localQty}
                onChange={onQtyChange}
                onBlur={onQtyBlur}
                disabled={updatingId === item.productId?._id}
                className="w-full py-2 pl-3 pr-7 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-center focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                placeholder="Qty"
              />
              <span className="absolute right-2 text-[10px] font-black text-slate-400 uppercase pointer-events-none">kg</span>
            </div>
            <div className="text-[10px] font-bold text-orange-500">
              Min: {minQty} kg | Max: {item.productId?.availableQuantityKg} kg
            </div>
          </div>

          <button 
            onClick={() => handleRemove(item.productId?._id)}
            disabled={updatingId === item.productId?._id}
            className="flex items-center gap-2 px-4 py-2 text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition disabled:opacity-50"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  // Auth check
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Please login to view your cart");
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingId(productId);
    await updateQuantity(productId, newQuantity);
    setUpdatingId(null);
  };

  const handleRemove = async (productId: string) => {
    setUpdatingId(productId);
    await removeFromCart(productId);
    setUpdatingId(null);
  };

  const handleCheckout = async () => {
    if (!user || !cart) return;
    if (user.walletBalance < totalPrice + deliveryCharge) {
      toast.error("Insufficient wallet balance!");
      return;
    }
    
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          items: cart.items,
          totalAmount: totalPrice + deliveryCharge,
          deliveryMethod,
          deliveryCharge,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      toast.success("Order placed successfully!");
      
      // Update local user wallet balance
      const updatedUser = { ...user, walletBalance: data.newBalance };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setOrderResult(data.order);
      clearCart();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const hasItems = cart && cart.items.length > 0;

  if (orderResult) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 sm:p-12 max-w-2xl w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>
          
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 size={48} />
          </div>

          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Order Confirmed!</h2>
          <p className="text-slate-500 font-bold mb-10 text-lg">Your fresh produce is being prepared for shipment.</p>

          <div className="bg-slate-50 rounded-[2rem] p-8 mb-10 text-left border border-slate-100">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                <p className="font-black text-slate-900">#{orderResult._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                <p className="font-black text-slate-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {orderResult.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xs font-black">{item.quantity}kg</span>
                    <span className="font-bold text-slate-700">{item.cropName}</span>
                  </div>
                  <span className="font-black text-slate-900">₹{item.total}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-slate-900">Total Paid</span>
                <span className="text-3xl font-black text-orange-600">₹{orderResult.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-green-50 rounded-2xl border border-green-100">
                <span className="text-xs font-black text-green-700 uppercase tracking-widest">New Wallet Balance</span>
                <span className="text-lg font-black text-green-700">₹{user?.walletBalance}</span>
              </div>
              <p className="text-[10px] font-black text-center text-slate-400 uppercase tracking-widest pt-2">✓ Payment Deducted from Digital Wallet</p>
            </div>
          </div>

          <button 
            onClick={() => router.push("/consumer/dashboard")}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-orange-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/consumer/dashboard" className="p-2 bg-white text-slate-500 rounded-xl shadow-sm hover:text-orange-600 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Cart</h1>
        </div>

        {!hasItems ? (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-orange-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 font-medium">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/consumer/dashboard" className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart Items & Delivery Selector */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                {cart.items.map((item: any) => (
                  <CartItemCard 
                    key={item._id} 
                    item={item} 
                    handleUpdateQuantity={handleUpdateQuantity} 
                    handleRemove={handleRemove} 
                    updatingId={updatingId} 
                  />
                ))}
              </div>

            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-slate-100 sticky top-24">
                <h3 className="text-xl font-black text-slate-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Items ({totalItems})</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Delivery Fee</span>
                    <span className={deliveryCharge === 0 ? "text-green-600 font-bold" : "text-slate-900 font-bold"}>
                      {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-3xl font-black text-slate-900">₹{totalPrice + deliveryCharge}</span>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-4 mb-8 border border-indigo-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Digital Wallet</span>
                    <span className="text-xs font-black text-indigo-600 px-2 py-1 bg-white rounded-lg border border-indigo-100 tracking-tighter">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-indigo-700">Available Balance</span>
                    <span className="text-xl font-black text-indigo-900">₹{user?.walletBalance || 0}</span>
                  </div>
                  {user?.walletBalance < totalPrice && (
                    <p className="text-[10px] text-red-500 font-bold mt-2 leading-none uppercase tracking-widest">Insufficient Funds</p>
                  )}
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={!user || user.walletBalance < totalPrice || isProcessing}
                  className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Confirm & Pay"}
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">Secure Wallet Payment Only</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
