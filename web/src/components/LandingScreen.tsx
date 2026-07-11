import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";

function LandingScreen() {
  return (
    <div className="h-screen bg-background text-text flex">
      {/* LEFT SIDE */}
      <div className="flex flex-1 flex-col p-8 lg:p-12 relative overflow-hidden">
        {/* NAVBAR */}
        <nav className="flex items-center justify-between relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent">
              <Image
                src="/logo.png"
                alt="Pulse Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>

            <span className="text-xl font-bold">Pulse</span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="px-5 py-2.5 text-sm font-medium text-muted hover:text-text transition">
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-linear-to-r from-primary to-accent hover:opacity-90 transition shadow-lg shadow-primary/30">
                Get Started
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </SignUpButton>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col justify-center max-w-xl relative z-10">
          {/* Tag */}
          <div className="mt-8 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
              <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
              Real-Time Communication
            </span>
          </div>
          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
            Stay connected,
            <br />
            <span className="bg-linear-to-r from-fuchsia-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              anytime, anywhere.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            Pulse is an intelligent chat platform that connects people through
            fast, seamless, and meaningful conversations.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-10 flex items-center gap-4">
            <SignUpButton mode="modal">
              <button className="group flex items-center gap-3 px-8 py-4  bg-surface font-semibold rounded-2xl hover:bg-card  transition">
                Start chatting
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>

            <SignInButton mode="modal">
              <button className="px-8 py-4 text-base-content/60 font-semibold hover:text-base-content transition">
                I have an account
              </button>
            </SignInButton>
          </div>

          {/* Avatars */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
              ].map((src, index) => (
                <div
                  key={index}
                  className="relative size-10 overflow-hidden rounded-full border-2 border-background"
                >
                  <Image
                    src={src}
                    alt={`User ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ))}

              <div className="flex items-center justify-center size-10 rounded-full border-2 border-background bg-primary text-white text-xs font-semibold">
                +5K
              </div>
            </div>

            <span className="text-sm text-muted">
              Join{" "}
              <span className="font-semibold text-text">
                thousands of conversations
              </span>{" "}
              on Pulse.
            </span>
          </div>

          {/* STATS */}
          <div className="mt-12 flex items-center gap-10">
            <div>
              <div className="text-2xl font-bold font-mono">10K+</div>
              <div className="text-xs text-muted mt-1 uppercase tracking-wider">
                Users
              </div>
            </div>

            <div className="w-px h-10 bg-border" />

            <div>
              <div className="text-2xl font-bold font-mono">99.9%</div>
              <div className="text-xs text-muted mt-1 uppercase tracking-wider">
                Uptime
              </div>
            </div>

            <div className="w-px h-10 bg-border" />

            <div>
              <div className="text-2xl font-bold font-mono">&lt;50ms</div>
              <div className="text-xs text-muted mt-1 uppercase tracking-wider">
                Latency
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex flex-1 relative bg-surface items-center justify-center overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(39,52,73,0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(39,52,73,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-linear-to-r from-primary/20 to-accent/20 rounded-full blur-[100px]" />

        {/* Image Container */}
        <div className="relative z-10">
          <div className="relative rounded-3xl border border-border bg-card/80 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
            <Image
              src="/dark-auth.png"
              alt="Chat illustration"
              width={384}
              height={384}
              className="w-72 sm:w-80 xl:w-96 rounded-2xl object-cover"
              priority
            />

            {/* Online Badge */}
            <div className="absolute -top-5 right-2 sm:-right-4 px-4 py-2 bg-success/15 border border-success/30 rounded-full text-success text-xs sm:text-sm font-medium backdrop-blur-xl shadow-lg">
              <span className="mr-1 animate-pulse">●</span>
              Live conversations
            </div>

            {/* Typing Indicator */}
            <div className="absolute -bottom-5 left-2 sm:-left-4 px-4 py-3 bg-background/80 border border-border rounded-2xl backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-3">
                {/* Avatars */}
                <div className="flex -space-x-2">
                  <Image
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                    alt="User avatar"
                    width={28}
                    height={28}
                    className="size-7 rounded-full border-2 border-background object-cover"
                  />

                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="User avatar"
                    width={28}
                    height={28}
                    className="size-7 rounded-full border-2 border-background object-cover"
                  />
                </div>

                {/* Typing text */}
                <div className="flex items-center gap-1 text-sm text-muted">
                  <span>Someone is typing</span>
                  <span className="flex gap-0.5">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce [animation-delay:150ms]">
                      .
                    </span>
                    <span className="animate-bounce [animation-delay:300ms]">
                      .
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingScreen;
