'use client';

export default function PlatformProfilePage() {
  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-2xl text-gray-800"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-[28px] font-semibold text-gray-900">
          Platform profile
        </h1>
        <div className="w-8" />
      </div>

      <div className="bg-white px-4 py-5">
        <p className="text-[18px] leading-8 text-gray-900">
          MALL is an intelligent cloud global order matching center with a sense
          of mission, which plays an important role in major e-commerce platforms
          around the world. Currently, MALL maintains close strategic partnership
          with Amazon, Alibaba, AliExpress, souq, jumia, maxfashion and Daraz.
          Cooperation, Blocking traffic through online vacuuming, updating layered
          product information through digital product reconstruction, enabling
          scenarios and enhancing competitiveness. MALL uses an intelligent cloud
          algorithm engine to accurately match buyers and users with established
          merchants and automatically match transactions, allowing many established
          merchants to stand out in the fierce business competition. MALL is not a
          single cloud shopping platform. Its greatest value lies in allowing
          consumers to earn commissions through free sharing while shopping
          normally. Merchants will have a promoter at the same time they pick up
          the order. With its leading 5G intelligent cloud matching technology,
          MALL has helped countless merchants and consumers.
        </p>
      </div>
    </div>
  );
}