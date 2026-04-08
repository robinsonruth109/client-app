'use client';

import { useEffect, useState } from 'react';
import clientApi from '@/lib/client-api';

type ClientMe = {
  id: number;
  username: string;
  invitationCode?: string | null;
};

export default function InvitePage() {
  const [client, setClient] = useState<ClientMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await clientApi.get('/auth/client-me');
        const data = res.data as ClientMe;
        setClient(data);

        if (typeof window !== 'undefined' && data?.invitationCode) {
          setInviteLink(
            `${window.location.origin}/register?code=${data.invitationCode}`,
          );
        } else {
          setInviteLink('');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const inviteCode = client?.invitationCode || '';

  const handleCopy = async (value: string, label: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(`${label} copied`);
      setTimeout(() => setCopied(''), 1500);
    } catch (error) {
      console.error(error);
      setCopied('Copy failed');
      setTimeout(() => setCopied(''), 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-6">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-2xl text-gray-800"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Invite friends
        </h1>
        <div className="w-8" />
      </div>

      <div className="px-4 py-4">
        <div className="overflow-hidden rounded-2xl bg-[#8b5a62] p-5 text-white shadow">
          <p className="text-sm uppercase tracking-wide text-white/80">
            Invite reward
          </p>
          <h2 className="mt-2 text-3xl font-bold">Invite your friends</h2>
          <p className="mt-2 text-sm text-white/90">
            Share your invitation code or link so new users can register under
            your team.
          </p>
        </div>

        <div className="mt-4 space-y-4 rounded-2xl bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {client?.username || '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Invitation code</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-lg font-semibold tracking-widest text-gray-900">
                {inviteCode || '-'}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(inviteCode, 'Code')}
                className="rounded-xl bg-[#8b5a62] px-4 py-3 text-white disabled:opacity-50"
                disabled={!inviteCode}
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Invitation link</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 break-all rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900">
                {inviteLink || 'Invite link unavailable'}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(inviteLink, 'Link')}
                className="rounded-xl bg-[#8b5a62] px-4 py-3 text-white disabled:opacity-50"
                disabled={!inviteLink}
              >
                Copy
              </button>
            </div>
          </div>

          {copied ? <p className="text-sm text-green-600">{copied}</p> : null}
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            How invitation works
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>• Share your invitation code with new users.</li>
            <li>• New users register using your code.</li>
            <li>• You can later view your team from the Teams page.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
