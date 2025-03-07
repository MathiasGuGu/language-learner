import AnkiDecksList from "./anki-decks-list";
import { AnkiDeckActions } from "./anki-decklist-actionbar";
import { Layers, BookOpen, TrendingUp } from "lucide-react";

export default function AnkiPage() {
  return (
    <div className="w-screen h-[calc(100vh_-_64px)] overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="w-full flex flex-col gap-8">
          {/* Header Section - Improved */}
          <div className="relative rounded-lg bg-white p-8 shadow-sm border border-indigo-200 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
            <div className="relative flex justify-between items-start">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    <Layers className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-slate-900">
                  Your Language Journey
                </h1>
                <p className="text-slate-600 text-lg mb-2">
                  Master new words, one card at a time
                </p>
              </div>
              <div className="flex items-center">
                <AnkiDeckActions />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Your Decks Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <BookOpen className="h-5 w-5 text-indigo-600 mr-2" strokeWidth={1.5} />
                    Your Decks
                  </h2>
                </div>
                <div className="p-6">
                  <AnkiDecksList />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Pre-made Decks Section */}
              <div className="bg-white rounded-lg shadow-sm border border-emerald-200 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                    <BookOpen className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 text-emerald-700">
                  Pre-made Decks
                </h2>
                <p className="text-slate-600 mb-4">
                  Start with curated collections for popular languages
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-600 group">
                  <span>Coming soon</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Trending Decks Section */}
              <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-600"></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                    <TrendingUp className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 text-amber-700">
                  Trending Decks
                </h2>
                <p className="text-slate-600 mb-4">
                  Discover popular vocabulary collections from the community
                </p>
                <div className="flex items-center gap-2 text-sm text-amber-600 group">
                  <span>Coming soon</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
