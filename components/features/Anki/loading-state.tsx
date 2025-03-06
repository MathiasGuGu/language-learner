"use client";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  isLoading: boolean;
  isEmpty: boolean;
  onBack?: () => void;
}

export function LoadingState({ isLoading, isEmpty, onBack }: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className="w-screen h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <BookOpen className="h-12 w-12 text-slate-400 animate-pulse" />
          <p className="text-slate-600 font-medium">Loading your study deck...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="w-screen h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="text-center max-w-md p-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-indigo-300" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">No Cards Available</h2>
          <p className="text-indigo-700 mb-8">
            This deck doesn't have any cards yet. Add some cards to start your language
            learning journey!
          </p>
          <Button
            onClick={onBack}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-none shadow-md hover:shadow-lg transition-all px-6 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return null;
}