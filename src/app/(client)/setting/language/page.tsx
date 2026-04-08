'use client';

import { useState } from 'react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'us', label: 'US' },
  { code: 'bd', label: 'Bangla' },
  { code: 'id', label: 'Indonesia' },
];

export default function LanguagePage() {
  const [selected, setSelected] = useState('us');

  const handleSave = () => {
    localStorage.setItem('client_language', selected);
    alert('Language updated successfully');
    window.history.back();
  };

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
          Language settings
        </h1>
        <div className="w-8" />
      </div>

      <div className="mt-3 bg-white">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setSelected(lang.code)}
            className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-5 text-left"
          >
            <span className="text-xl text-gray-800">{lang.label}</span>
            <span className="text-2xl text-[#7a4d4d]">
              {selected === lang.code ? '✓' : ''}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 px-4">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-[#7a4d4d] py-4 text-xl text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}