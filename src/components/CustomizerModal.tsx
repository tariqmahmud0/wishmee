import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BirthdayData, RelationType, MemoryItem } from '../types';
import { templates } from '../data/templates';
import { X, Check, Upload, Share2, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BirthdayData;
  onSave: (newData: BirthdayData) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [name, setName] = useState(data.name);
  const [senderName, setSenderName] = useState(data.senderName || 'তারিক মাহমুদ');
  const [relation, setRelation] = useState<RelationType>(data.relation);
  const [customGreeting, setCustomGreeting] = useState(data.customGreeting || '');
  const [letterParagraphs, setLetterParagraphs] = useState<string[]>(
    data.customLetterText && data.customLetterText.length > 0
      ? data.customLetterText
      : templates[data.relation].letter
  );
  const [themeColor, setThemeColor] = useState<BirthdayData['themeColor']>(data.themeColor);
  const [memories, setMemories] = useState<MemoryItem[]>(data.memories);
  const [copiedLink, setCopiedLink] = useState(false);

  // When relation changes, optionally reset letter if default
  const handleRelationChange = (newRel: RelationType) => {
    setRelation(newRel);
    setLetterParagraphs(templates[newRel].letter);
    if (!customGreeting) {
      setCustomGreeting(templates[newRel].greeting);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, memoryId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setMemories((prev) =>
        prev.map((m) => (m.id === memoryId ? { ...m, type: 'image', content: base64 } : m))
      );
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemory = () => {
    const newId = String(Date.now());
    const newMem: MemoryItem = {
      id: newId,
      type: 'emoji',
      content: '🌟',
      caption: 'নতুন স্মৃতি',
    };
    setMemories([...memories, newMem]);
  };

  const handleRemoveMemory = (id: string) => {
    setMemories(memories.filter((m) => m.id !== id));
  };

  const handleSave = () => {
    sound.playClick();
    onSave({
      ...data,
      name: name.trim() || 'প্রিয় মানুষ',
      senderName: senderName.trim() || 'তারিক মাহমুদ',
      relation,
      customGreeting: customGreeting.trim(),
      customLetterText: letterParagraphs,
      themeColor,
      memories,
    });
    onClose();
  };

  const handleShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('name', name);
    url.searchParams.set('sender', senderName);
    url.searchParams.set('relation', relation);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    sound.playClick();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden text-left"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-lg text-gray-800 font-anek">
                শুভেচ্ছা ওয়েবসাইট কাস্টমাইজ করুন
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-sans">
            {/* Recipient Name */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5 font-anek text-base">
                ১. যার জন্মদিন তার নাম:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: যুথি"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-800"
              />
            </div>

            {/* Sender Name */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5 font-anek text-base">
                ২. চিঠি প্রেরকের নাম (আপনার নাম):
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="যেমন: তারিক মাহমুদ"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-800"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5 font-anek text-base">
                ৩. সম্পর্ক নির্ধারণ করুন:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(templates) as RelationType[]).map((relKey) => (
                  <button
                    key={relKey}
                    type="button"
                    onClick={() => handleRelationChange(relKey)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      relation === relKey
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{templates[relKey].relationLabel}</span>
                    {relation === relKey && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Customization */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5 font-anek text-base">
                ৩. চিঠির আন্তরিক শুভেচ্ছা বার্তা:
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={customGreeting}
                  onChange={(e) => setCustomGreeting(e.target.value)}
                  placeholder="চিঠির শুরু (যেমন: আমার প্রাণপ্রিয় ভালোবাসা,)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 font-semibold"
                />
                {letterParagraphs.map((para, idx) => (
                  <textarea
                    key={idx}
                    rows={2}
                    value={para}
                    onChange={(e) => {
                      const updated = [...letterParagraphs];
                      updated[idx] = e.target.value;
                      setLetterParagraphs(updated);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700"
                  />
                ))}
              </div>
            </div>

            {/* Memories & Photos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700 font-anek text-base">
                  ৪. স্মৃতির ছবি ও ক্যাপশন (Polaroids):
                </label>
                <button
                  type="button"
                  onClick={handleAddMemory}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  + নতুন যোগ করুন
                </button>
              </div>

              <div className="space-y-3">
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-3"
                  >
                    {/* Preview / Emoji / Image */}
                    <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      {mem.type === 'image' ? (
                        <img src={mem.content} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{mem.content}</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={mem.caption}
                        onChange={(e) =>
                          setMemories(
                            memories.map((m) =>
                              m.id === mem.id ? { ...m, caption: e.target.value } : m
                            )
                          )
                        }
                        placeholder="ক্যাপশন (যেমন: সুন্দর দিন)"
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white"
                      />

                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-medium cursor-pointer hover:underline">
                          <Upload className="w-3 h-3" />
                          <span>ছবি আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, mem.id)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {memories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMemory(mem.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Share Link Generator */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-rose-900 text-xs font-anek">
                  সরাসরি শুভেচ্ছা লিংক শেয়ার করুন
                </p>
                <p className="text-[11px] text-rose-700">
                  বন্ধুর নাম ও সম্পর্কসহ লিংক কপি করে হোয়াটসঅ্যাপে পাঠিয়ে দিন!
                </p>
              </div>
              <button
                type="button"
                onClick={handleShareLink}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500 text-white font-semibold text-xs shadow-sm hover:bg-rose-600 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>লিংক কপি</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-200 text-sm font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
