"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Heart,
  MessageCircle,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          About ZeroVerse
        </h1>
        <p className="text-lg text-muted-foreground">
          A safe, anonymous space for college students to connect, share, and
          support each other.
        </p>
      </div>

      {/* About Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            Our Community
          </h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          ZeroVerse is an anonymous platform designed exclusively for college
          students. Here, you can freely express yourself, share experiences,
          seek advice, and discuss everything from hostel life and exams to
          placements and campus gossip—all while maintaining your privacy.
        </p>
      </div>

      {/* Community Guidelines */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            Community Guidelines
          </h2>
        </div>

        <div className="space-y-6">
          {/* Rule 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Be Respectful & Kind
              </h3>
              <p className="text-muted-foreground">
                Treat everyone with respect and empathy. Remember, there's a
                real person behind every post. Harassment, bullying, hate
                speech, or discriminatory content of any kind will not be
                tolerated.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Stay On Topic
              </h3>
              <p className="text-muted-foreground">
                Use appropriate categories for your posts. Keep discussions
                relevant to college life, academics, campus activities, and
                student experiences. Spam and off-topic content will be removed.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Protect Privacy
              </h3>
              <p className="text-muted-foreground">
                While you're anonymous, respect others' privacy too. Don't share
                personal information (names, phone numbers, addresses) of
                yourself or others. Don't attempt to reveal someone's identity.
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Harmful Content
              </h3>
              <p className="text-muted-foreground">
                Do not post content that promotes violence, self-harm, illegal
                activities, or explicit material. Keep the platform safe and
                appropriate for all students.
              </p>
            </div>
          </div>

          {/* Rule 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Be Authentic & Constructive
              </h3>
              <p className="text-muted-foreground">
                Share genuine experiences and provide constructive feedback.
                Avoid spreading misinformation or creating fake posts. When
                disagreeing, do so respectfully and focus on the issue, not the
                person.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consequences */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Consequences
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Violations of these guidelines may result in content removal,
          temporary suspension, or permanent ban from the platform, depending on
          the severity of the offense.
        </p>
      </div>

      {/* Footer Message */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
        <p className="text-foreground font-medium mb-2">
          Together, we build a better community 💙
        </p>
        <p className="text-sm text-muted-foreground">
          If you see something that violates these guidelines, please report it.
          Let's keep ZeroVerse a safe and supportive space for everyone.
        </p>
      </div>
    </div>
  );
}
