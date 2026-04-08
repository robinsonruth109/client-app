'use client';

export default function CooperationPage() {
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
          Win-win cooperation
        </h1>
        <div className="w-8" />
      </div>

      <div className="bg-white px-4 py-5">
        <p className="text-[18px] leading-8 text-gray-900">
          At MALL, we carry out win-win cooperation for all users around the
          world, increase the interaction between users and merchants, help users
          make money, and help merchants make profits. We retain company results.
          We abide by the rules and are committed to building a well-known
          cooperative e-commerce company. Through its own technology to guide the
          development of e-commerce industry, we are committed to becoming the
          creator of industry standards. This is our constant pursuit and
          corporate vision. We also thank all MALL partners and users for their
          support and valuable time. Let us work hard to achieve win-win
          cooperation and gain huge benefits!
        </p>
      </div>
    </div>
  );
}