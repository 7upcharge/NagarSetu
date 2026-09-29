'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCivic } from '../../context/CivicContext';
import { Category, Severity, CivicIssue } from '../../types';
import { MatchAgent } from '../../agents/MatchAgent';
import { MapPin, Search, CheckCircle2, AlertTriangle, ArrowRight, Upload, Sparkles, Layers, ShieldCheck } from 'lucide-react';

const CATEGORIES: Category[] = [
  'Garbage',
  'Roads',
  'Water',
  'Streetlights',
  'Drainage',
  'Safety',
  'Public Property'
];

const SEVERITIES: Severity[] = ['Low', 'Moderate', 'High', 'Critical'];

const SAMPLE_PHOTOS = [
  { label: 'Garbage Waste', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' },
  { label: 'Road Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Streetlight', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80' }
];

export default function ReportPage() {
  const router = useRouter();
  const { issues, createNewReport, supportIssue } = useCivic();

  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Garbage');
  const [location, setLocation] = useState('Main Gate, Sector 4');
  const [severity, setSeverity] = useState<Severity>('Moderate');
  const [photo, setPhoto] = useState(SAMPLE_PHOTOS[0].url);

  // Duplicate match state
  const [matchCheckDone, setMatchCheckDone] = useState(false);
  const [possibleMatch, setPossibleMatch] = useState<CivicIssue | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('Checking nearby community reports...');

  // Search input change triggers Match Agent
  const handleTitleBlurOrSearch = () => {
    if (!title.trim()) return;

    const result = MatchAgent.findBestMatch(title, description, category, issues);
    if (result.hasMatch && result.matchedIssue) {
      setPossibleMatch(result.matchedIssue);
      setMatchCheckDone(true);
    } else {
      setPossibleMatch(null);
      setMatchCheckDone(true);
    }
  };

  const handleJoinExisting = () => {
    if (!possibleMatch) return;
    supportIssue(possibleMatch.id);
    router.push(`/issues/${possibleMatch.id}`);
  };

  const handleProceedNewProblem = () => {
    setMatchCheckDone(false);
    setStep(2);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingText('Checking nearby community reports...');

    setTimeout(() => {
      setProcessingText('Normalizing report and calculating initial priority score...');
      setTimeout(() => {
        const { newIssue } = createNewReport({
          title,
          description,
          category,
          location,
          photo,
          severity
        });
        setIsProcessing(false);
        router.push(`/issues/${newIssue.id}`);
      }, 700);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5 space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Civic Intake
        </span>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          Report a Problem
        </h1>
        <p className="text-sm text-stone-600">
          Start a new report or join an existing community signal so local authorities prioritize action.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs flex items-center justify-between text-xs font-mono">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-800 font-bold' : 'text-stone-400'}`}>
          <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs">
            1
          </span>
          <span>Describe & Match</span>
        </div>
        <span className="text-stone-300">──</span>

        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-800 font-bold' : 'text-stone-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-stone-900 text-amber-400' : 'bg-stone-100 text-stone-500'}`}>
            2
          </span>
          <span>Location</span>
        </div>
        <span className="text-stone-300">──</span>

        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-800 font-bold' : 'text-stone-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-stone-900 text-amber-400' : 'bg-stone-100 text-stone-500'}`}>
            3
          </span>
          <span>Severity</span>
        </div>
        <span className="text-stone-300">──</span>

        <div className={`flex items-center gap-2 ${step >= 4 ? 'text-amber-800 font-bold' : 'text-stone-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 4 ? 'bg-stone-900 text-amber-400' : 'bg-stone-100 text-stone-500'}`}>
            4
          </span>
          <span>Photo & Submit</span>
        </div>
      </div>

      {/* Processing Animation Overlay */}
      {isProcessing && (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4 shadow-sm animate-pulse">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">{processingText}</h3>
          <p className="text-xs text-stone-500 font-mono">Running Orchestrator multi-agent validation sequence...</p>
        </div>
      )}

      {/* Step 1: Duplicate Match Check & Description */}
      {!isProcessing && step === 1 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-stone-900">Step 1: What is happening?</h2>
            <p className="text-xs text-stone-600">
              Enter the issue category and title to check if this problem is already happening nearby.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-3 text-sm text-stone-900 font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Title of the problem
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setMatchCheckDone(false);
                  }}
                  onBlur={handleTitleBlurOrSearch}
                  placeholder="e.g. Overflowing garbage near Main Gate"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-3 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Tip: Try typing "Garbage near Main Gate" to test automatic duplicate matching.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Detailed description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed, how long it has been present, and any safety hazards..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-3 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleTitleBlurOrSearch}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-lg flex items-center justify-center gap-2"
            >
              <span>Check nearby community reports</span>
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* POSSIBLE MATCH CARD UI */}
          {matchCheckDone && possibleMatch && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>We found a similar problem nearby!</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-amber-200 space-y-2">
                <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                  POSSIBLE MATCH #{possibleMatch.id.replace('issue-', '')}
                </span>
                <h4 className="text-base font-bold text-stone-900">{possibleMatch.title}</h4>
                <p className="text-xs text-stone-600">{possibleMatch.description}</p>
                <div className="flex items-center gap-4 text-xs font-mono text-stone-700 pt-1">
                  <span>{possibleMatch.communityReports} reports</span>
                  <span>{possibleMatch.peopleAffected} people affected</span>
                  <span className="font-bold text-amber-700">{possibleMatch.severity} Severity</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleJoinExisting}
                  className="px-4 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>I'm affected too (Join existing report)</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedNewProblem}
                  className="px-4 py-3 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-xs rounded-lg border border-stone-300"
                >
                  <span>This is a different problem</span>
                </button>
              </div>
            </div>
          )}

          {matchCheckDone && !possibleMatch && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center space-y-3">
              <p className="text-xs font-medium text-stone-700">
                No matching reports found nearby. Proceeding with new report creation.
              </p>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!title.trim()}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-lg inline-flex items-center gap-2"
              >
                <span>Proceed to Step 2: Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Location */}
      {!isProcessing && step === 2 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-stone-900">Step 2: Where is it?</h2>
            <p className="text-xs text-stone-600">Specify the location details or select from mock map grid.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Location Address / Landmark
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Main Gate, Sector 4"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-3 pr-10 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
                <MapPin className="w-4 h-4 text-amber-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Mock Map Preview Box */}
            <div className="bg-stone-900 text-stone-300 rounded-xl p-6 border border-stone-800 text-center space-y-3 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 space-y-2">
                <MapPin className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                <p className="text-xs font-mono text-stone-200 font-bold">Mock Map Pin Location Selected</p>
                <p className="text-[11px] text-stone-400 font-mono">
                  Coordinates: 22.7196° N, 75.8577° E (Sector 4 Public Grid)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold text-xs rounded-lg"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
              >
                <span>Proceed to Step 3: Severity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Severity */}
      {!isProcessing && step === 3 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-stone-900">Step 3: How serious is it?</h2>
            <p className="text-xs text-stone-600">
              Select the initial severity rating to weight priority calculation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SEVERITIES.map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverity(sev)}
                className={`p-4 rounded-xl border text-center font-bold text-xs transition-all ${
                  severity === sev
                    ? 'bg-stone-900 text-amber-400 border-stone-900 shadow-md scale-105'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                }`}
              >
                <span className="block text-sm mb-1">{sev}</span>
                <span className="text-[10px] font-normal text-stone-400">
                  {sev === 'Critical' ? 'Immediate hazard' : sev === 'High' ? 'Severe bottleneck' : 'Standard issue'}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold text-xs rounded-lg"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
            >
              <span>Proceed to Step 4: Photo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Add Photo & Submit */}
      {!isProcessing && step === 4 && (
        <form onSubmit={handleSubmitReport} className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-stone-900">Step 4: Add photo & submit</h2>
            <p className="text-xs text-stone-600">Select a sample photo or upload evidence.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Select Sample Evidence Photo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_PHOTOS.map((sp) => (
                <div
                  key={sp.label}
                  onClick={() => setPhoto(sp.url)}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    photo === sp.url ? 'border-amber-600 ring-2 ring-amber-200' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={sp.url} alt={sp.label} className="h-24 w-full object-cover" />
                  <div className="p-1.5 bg-stone-50 text-[11px] text-center font-medium text-stone-800">
                    {sp.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Photo Preview */}
            {photo && (
              <div className="relative h-48 rounded-xl overflow-hidden border border-stone-300">
                <img src={photo} alt="Selected photo" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-stone-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  Photo Attached
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold text-xs rounded-lg"
              >
                Back
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm rounded-lg shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-stone-950" />
                <span>Submit Civic Report</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
