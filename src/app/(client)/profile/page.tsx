'use client';

import { useEffect, useRef, useState } from 'react';
import clientApi from '@/lib/client-api';

type ClientMe = {
  id: number;
  username: string;
  balance: number;
  vipLevel: number;
  invitationCode?: string;
  avatarUrl?: string | null;
};

function resizeImage(file: File, maxWidth = 500, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');

        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const [client, setClient] = useState<ClientMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchMe = async () => {
    try {
      const res = await clientApi.get('/auth/client-me');
      setClient(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !client) return;

    try {
      setUploading(true);

      const compressedImage = await resizeImage(file, 500, 0.7);

      await clientApi.patch(`/clients/${client.id}/avatar`, {
        avatarUrl: compressedImage,
      });

      await fetchMe();
      alert('Profile picture updated successfully');
    } catch (error: any) {
      console.error(error);
      alert(
        error?.response?.data?.message || 'Failed to update profile picture',
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-2xl text-gray-800"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Profile
        </h1>
        <div className="w-8" />
      </div>

      <div className="mt-2 bg-white">
        <button
          type="button"
          onClick={handleChooseFile}
          className="flex w-full items-center justify-between px-4 py-5 text-left"
        >
          <span className="text-xl text-gray-800">Personal Avatar</span>

          <div className="flex items-center gap-3">
            <img
              src={
                client?.avatarUrl ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop'
              }
              alt="avatar"
              className="h-16 w-16 rounded-full object-cover"
            />
            <span className="text-sm text-gray-500">
              {uploading ? 'Uploading...' : 'Change'}
            </span>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}