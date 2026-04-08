'use client';

export default function PlatformRulesPage() {
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
          Platform rules
        </h1>
        <div className="w-8" />
      </div>

      <div className="bg-white px-4 py-5">
        <p className="text-[18px] leading-8 text-gray-900">
          About recharge: [The platform will change the recharge method from time
          to time] Each user should click the recharge interface to check the
          latest recharge method before recharging, so as to avoid recharge
          failure on the old account due to recharge. If your recharge request has
          not been completed, please contact the recharge customer service for
          consultation in time. About withdrawal: The minimum withdrawal amount of
          MALL is 20USDT, and the minimum deposit amount is 10USDT. When you
          request a withdrawal, we will process it immediately and arrive within
          24 hours. Due to the large number of users on the platform, in order to
          ensure that each user has a good experience and normal withdrawal,
          please wait patiently for the withdrawal process to complete. Please
          understand that, if you do not receive the money on the withdrawal slip
          within 24 hours, please contact customer service in time! About freezing
          the order: If the order is not delivered within 10 minutes after the
          user places the order, or the user returns to the page after receiving
          the order, the order will be frozen. Just click [Home] - [Order] to
          send immediately. Only one account with the correct mobile number is
          allowed to register with MALL per identical username. If the system
          monitors you to register multiple accounts and IPs, you will be
          suspected of illegal money laundering, which will affect normal
          withdrawals and cause the account to be frozen.
        </p>
      </div>
    </div>
  );
}