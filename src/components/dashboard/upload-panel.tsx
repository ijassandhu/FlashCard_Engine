'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUp, Sparkles, UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/skeleton";
import { generationSteps, sampleDocuments } from "@/data/mock-data";

export function UploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsGenerating(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate flashcards');
      }

      const data = await res.json();
      router.push(`/deck/${data.deckId}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during generation.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className={`rounded-lg border border-dashed border-accent/45 bg-accent/5 p-6 sm:p-10 transition-all ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-background text-accent shadow-sm">
              {isGenerating ? <Loader2 className="size-7 animate-spin" /> : <UploadCloud className="size-7" aria-hidden="true" />}
            </span>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {isGenerating ? 'Analyzing document...' : 'Drop in a PDF to start a deck'}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              {isGenerating ? 'Extracting concepts and generating smart flashcards. This may take a moment.' : 'Upload course notes, a textbook chapter, or a reading packet. The generation engine will turn it into organized cards.'}
            </p>
            
            {!isGenerating && (
              <>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row w-full justify-center items-center">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                      <FileUp aria-hidden="true" className="mr-2 h-4 w-4" />
                      Choose PDF
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  
                  {file && (
                    <Button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Sparkles className="mr-2 h-4 w-4" /> Generate AI Cards
                    </Button>
                  )}
                </div>
                {file && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 border border-slate-200">
                    <FileUp className="h-4 w-4 text-slate-500" />
                    <span>Selected file: <span className="font-semibold text-slate-900">{file.name}</span></span>
                  </div>
                )}
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <p className="mt-4 text-xs text-muted-foreground">
                  Accepted file type: PDF. Recommended length: 5-80 pages.
                </p>
              </>
            )}
          </div>
        </div>

        {!isGenerating && (
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Try with a sample document
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleDocuments.map((sample) => (
                <Badge key={sample} variant="secondary">
                  {sample}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isGenerating ? (
          <div className="space-y-4 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
          </div>
        ) : (
          <EmptyState
            icon={<Sparkles className="size-8" aria-hidden="true" />}
            title="No document selected"
            description="Your generated deck preview, topic map, and card counts will appear here after generation."
          />
        )}
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>How generation works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {generationSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
