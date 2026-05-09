import React from 'react';
import { 
  Users, 
  Sprout, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  TrendingUp, 
  MessageSquare, 
  Languages 
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-4">
          Empowering the Roots, Feeding the Future
        </h1>
        <p className="text-lg text-slate-600">
          A dual-sided ecosystem designed to bring transparency, better margins for farmers, 
          and fresher produce for consumers.
        </p>
      </div>

      {/* Main Feature Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Auth & Identity */}
        <FeatureCard 
          icon={Users}
          title="Smart Onboarding"
          description="Verified profiles for Farmers (Aadhaar-linked OTP) and Consumers. Secure MongoDB storage ensures your data stays private and safe."
        />

        {/* Farmer Specific */}
        <FeatureCard 
          icon={Sprout}
          title="Farmer Listings"
          description="Directly upload crops with images, harvest dates, and pricing. Access 'Ugly Sell' for discounted surplus and 'Pre-list' for future harvests."
        />

        {/* Consumer Specific */}
        <FeatureCard 
          icon={ShoppingBag}
          title="Proximity-Based Buying"
          description="Find fresh produce nearby using PIN code validation. Trello-style cards show you exactly how far your food traveled."
        />

        {/* Logistics & Payment */}
        <FeatureCard 
          icon={Truck}
          title="Secure Fulfillment"
          description="Escrow-style payments. Funds are released to farmers within 24 hours of a successful OTP-verified delivery partner pickup."
        />

        {/* Market Intel */}
        <FeatureCard 
          icon={TrendingUp}
          title="Real-Time Analytics"
          description="Farmers get live market price trends via external APIs and a dedicated dashboard to track orders, ratings, and reviews."
        />

        {/* Communication */}
        <FeatureCard 
          icon={MessageSquare}
          title="Direct Communication"
          description="Integrated chat system allows farmers and consumers to coordinate logistics post-order, supported in English and Hindi."
        />
      </div>

      {/* Special Sections */}
      <div className="max-w-7xl mx-auto mt-20">
        <div className="bg-green-700 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <ShieldCheck /> The Trust Guarantee
            </h2>
            <ul className="space-y-3 opacity-90">
              <li>• 24-hour cancellation policy for total consumer peace of mind.</li>
              <li>• Automated penalty system for delivery delays to ensure farmer accountability.</li>
              <li>• Verified bank transfers directly to registered farmer accounts.</li>
            </ul>
          </div>
          <button className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors">
            Join the Movement
          </button>
        </div>
      </div>

      {/* Language Toggle Placeholder */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-white shadow-lg border border-slate-200 px-4 py-2 rounded-full flex items-center gap-2 font-medium hover:bg-slate-50 transition-all">
          <Languages size={18} />
          <span>EN / HI</span>
        </button>
      </div>
    </div>
  );
}