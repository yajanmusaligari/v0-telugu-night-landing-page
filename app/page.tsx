"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  MapPin,
  Music,
  Users,
  Utensils,
  IndianRupee,
  ChevronDown,
  Volume2,
  VolumeX,
  Plus,
} from "lucide-react"
import { AnimatedSection } from "@/components/AnimatedSection"
import { useScrollBlur } from "@/hooks/useScrollBlur"

export default function TeluguNightLanding() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollY, blurAmount } = useScrollBlur()

  // Memoized target date to prevent recalculation
  const targetDate = useMemo(() => new Date("2025-08-03T19:00:00").getTime(), [])

  // Optimized countdown timer with useCallback
  const updateCountdown = useCallback(() => {
    const now = new Date().getTime()
    const difference = targetDate - now

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
    }
  }, [targetDate])

  useEffect(() => {
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [updateCountdown])

  // Force auto-play audio on component mount with multiple attempts
  useEffect(() => {
    const forcePlayAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.8
          audioRef.current.muted = false
          
          // Multiple attempts to ensure playback
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            await playPromise
          }
        } catch (error) {
          console.log("First attempt failed, trying again:", error)
          // Second attempt after a short delay
          setTimeout(async () => {
            try {
              if (audioRef.current) {
                await audioRef.current.play()
              }
            } catch (secondError) {
              console.log("Second attempt failed:", secondError)
            }
          }, 1000)
        }
      }
    }

    // Auto-play video as well
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play()
        } catch (error) {
          console.log("Video auto-play was prevented:", error)
        }
      }
    }

    // Try to play immediately
    forcePlayAudio()
    playVideo()

    // Also try on user interaction
    const handleUserInteraction = () => {
      forcePlayAudio()
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMutedState = !isMuted
      audioRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    }
  }, [isMuted])

  const openSongSuggestions = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeXkOqRQiqViyCEmW7NNksrl94633z9bfmtRnlhp0vL3vks-w/viewform', '_blank')
  }

  return (
    <div className="min-h-screen text-white font-serif relative overflow-x-hidden" style={{
      background: 'linear-gradient(135deg, #2c1810 0%, #1a0f08 50%, #0d0704 100%)',
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(160, 82, 45, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(101, 67, 33, 0.1) 0%, transparent 50%)
      `
    }}>
      {/* Background Audio with autoplay attributes */}
      <audio
        ref={audioRef}
        loop
        autoPlay
        preload="auto"
        muted={false}
        onError={(e) => {
          console.error("Audio error:", e)
        }}
        onLoadedData={() => {
          console.log("Audio loaded successfully")
          if (audioRef.current) {
            audioRef.current.volume = 0.8
            audioRef.current.play().catch(console.error)
          }
        }}
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ene-fMXduK1wvhZtAy9z0Jnivz9GQSvKpN.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900/90 via-yellow-800/90 to-amber-900/90 backdrop-blur-sm border-b-2 border-amber-600/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Audio Mute Control */}
            <button
              onClick={toggleMute}
              className="bg-amber-800/80 backdrop-blur-sm border border-amber-600/50 rounded-full p-2 hover:bg-amber-700/80 transition-colors duration-150 touch-manipulation"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Song Suggestions Button */}
          <button
            onClick={openSongSuggestions}
            className="bg-gradient-to-r from-amber-700 to-yellow-600 text-white font-bold px-4 py-2 rounded-lg hover:from-amber-600 hover:to-yellow-500 transition-all duration-200 border-2 border-amber-500 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Your Song Suggestions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-7xl mx-auto w-full">
            {/* Main Title with Video Background */}
            <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16 py-[60px] sm:py-[80px]">
              <div
                className="relative aspect-square max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto rounded-lg sm:rounded-xl lg:rounded-2xl border-4 border-amber-600/60 bg-black overflow-hidden shadow-2xl"
                style={{
                  boxShadow:
                    "0 0 60px rgba(255, 193, 7, 0.4), 0 0 120px rgba(255, 193, 7, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Video Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    style={{
                      filter: `blur(${blurAmount}px) brightness(0.6) sepia(0.3) saturate(1.2) drop-shadow(0 0 40px rgba(255, 193, 7, 0.3))`,
                      objectPosition: "center center",
                      minWidth: "100%",
                      minHeight: "100%",
                      transform: "scale(1.0)",
                    }}
                  >
                    <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ene%20%281%29-8pE5Sy5CmTmieOXwVxIer1prre9eF7.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-transparent to-black/60"></div>
                </div>

                {/* Title Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20">
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-amber-100 tracking-wider font-serif leading-[0.9] text-center uppercase"
                    style={{
                      textShadow:
                        "0 0 30px rgba(255, 193, 7, 0.8), 0 0 60px rgba(255, 193, 7, 0.6), 0 8px 16px rgba(0, 0, 0, 0.9)",
                      fontFamily: 'Georgia, "Times New Roman", serif',
                    }}
                  >
                    TELUGU రాత్రి
                  </h1>
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-300 mb-2 sm:mb-3 md:mb-4 tracking-wide"
                    style={{
                      textShadow: "0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.9)",
                      fontFamily: 'Georgia, "Times New Roman", serif',
                    }}>
                    Classical Evening 🎵
                  </div>
                  <div className="w-8 sm:w-12 md:w-16 h-1 bg-amber-400/90 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full"></div>
                  <p
                    className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-amber-100/95 font-bold tracking-tight text-center px-2 font-serif"
                    style={{ 
                      textShadow: "0 0 15px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.8)",
                      fontFamily: 'Georgia, "Times New Roman", serif',
                    }}
                  >
                    August 3rd • DTR, Manipal
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-yellow-200/90 font-bold mt-2 px-2 font-serif"
                    style={{ 
                      textShadow: "0 0 15px rgba(0, 0, 0, 0.7)",
                      fontFamily: 'Georgia, "Times New Roman", serif',
                    }}>
                    🎶 Telugu Music • Dance • Culture • Food 🎶</p>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            {scrollY < 50 && (
              <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="bg-amber-800/90 backdrop-blur-sm rounded-full p-2.5 sm:p-3 border border-amber-600/50 shadow-lg">
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100/80" />
                </div>
              </div>
            )}

            {/* Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-12 lg:mb-16 max-w-5xl mx-auto">
              <AnimatedSection animation="fadeUp" delay={0}>
                <div className="text-center py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl border-2 transition-colors duration-200 bg-gradient-to-br from-amber-900/60 to-yellow-800/60 border-amber-600/80 shadow-xl backdrop-blur-sm">
                  <Calendar className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 mx-auto mb-2 sm:mb-3 md:mb-4 text-amber-200/80" />
                  <h3 className="text-xs sm:text-sm font-bold text-amber-100/70 uppercase tracking-tight mb-1 sm:mb-2 md:mb-3 font-serif">
                    Date
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-bold font-serif">
                    3rd August 2025
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fadeUp" delay={50}>
                <div className="text-center py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl border-2 transition-colors duration-200 bg-gradient-to-br from-amber-900/60 to-yellow-800/60 border-amber-600/80 shadow-xl backdrop-blur-sm">
                  <Clock className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 mx-auto mb-2 sm:mb-3 md:mb-4 text-amber-200/80" />
                  <h3 className="text-xs sm:text-sm font-bold text-amber-100/70 uppercase tracking-tight mb-1 sm:mb-2 md:mb-3 font-serif">
                    Time
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-bold font-serif">
                    7:00 PM - 11:00 PM
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fadeUp" delay={100}>
                <div className="text-center py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl border-2 transition-colors duration-200 bg-gradient-to-br from-amber-900/60 to-yellow-800/60 border-amber-600/80 shadow-xl backdrop-blur-sm">
                  <MapPin className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 mx-auto mb-2 sm:mb-3 md:mb-4 text-amber-200/80" />
                  <h3 className="text-xs sm:text-sm font-bold text-amber-100/70 uppercase tracking-tight mb-1 sm:mb-2 md:mb-3 font-serif">
                    Venue
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-bold font-serif">
                    DTR, Manipal
                  </p>
                </div>
              </AnimatedSection>
            </div>

            {/* Pricing */}
            <AnimatedSection animation="fadeIn" className="mb-6 sm:mb-8 md:mb-12">
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-xl sm:rounded-2xl border-2 transition-colors duration-200 bg-gradient-to-br from-amber-900/80 to-yellow-800/80 border-amber-500/70 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                  <IndianRupee className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-amber-100/90 mr-1 sm:mr-2" />
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-100 tracking-tight font-serif">300</span>
                </div>
                <p className="text-amber-100/90 text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 md:mb-3 text-center font-serif">
                  Entry Pass
                </p>
                <p className="text-amber-200/70 text-xs sm:text-sm text-center leading-relaxed px-2 font-bold font-serif">
                  Includes ₹200 cover charge redeemable for food & drinks
                </p>
              </div>
            </AnimatedSection>

            {/* Countdown Timer */}
            <AnimatedSection animation="fadeUp">
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-xl sm:max-w-2xl mx-auto rounded-xl sm:rounded-2xl border-2 transition-colors duration-200 bg-gradient-to-br from-amber-900/60 to-yellow-800/60 border-amber-600/80 shadow-2xl backdrop-blur-sm">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 md:mb-8 text-amber-100/90 uppercase tracking-tight text-center font-serif">
                  Event Countdown
                </h3>
                <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className="p-2 sm:p-3 md:p-4 lg:p-6 mb-1 sm:mb-2 md:mb-4 rounded-lg sm:rounded-xl border-2 transition-colors duration-200 bg-gradient-to-br from-amber-800/60 to-yellow-700/60 border-amber-500/80 shadow-xl backdrop-blur-sm">
                        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-100 tracking-tight block font-serif">
                          {value}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm uppercase tracking-wider text-amber-200/70 font-medium block font-serif">
                        {unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection animation="fadeUp" className="text-center mb-12 sm:mb-16 md:mb-20">
              <div className="bg-gradient-to-br from-amber-900/60 to-yellow-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 border-2 border-amber-600/80 shadow-2xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-100 mb-3 sm:mb-4 md:mb-6 tracking-tight font-serif">
                  What to Expect
                </h2>
                <div className="w-12 sm:w-16 h-1 bg-amber-400/70 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-full"></div>
                <p className="text-base sm:text-lg md:text-xl text-amber-100/80 max-w-2xl mx-auto font-serif">
                  An evening celebrating Telugu music and culture
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  icon: Music,
                  title: "Telugu Hits",
                  description: "Curated playlist of contemporary and classic Telugu hits",
                },
                {
                  icon: Users,
                  title: "Dance Floor",
                  description: "Open space for dancing and socializing with fellow attendees",
                },
                {
                  icon: Utensils,
                  title: "Telugu Cuisine",
                  description: "Selection of refreshments available throughout the evening",
                },
                {
                  icon: () => (
                    <div className="w-6 sm:w-8 h-6 sm:h-8 bg-amber-700/50 rounded-full flex items-center justify-center">
                      <div className="w-2 sm:w-3 h-2 sm:h-3 bg-amber-100/70 rounded-full"></div>
                    </div>
                  ),
                  title: "Cultural Vibe",
                  description: "Immersive environment celebrating Telugu culture",
                },
              ].map(({ icon: Icon, title, description }, index) => (
                <AnimatedSection key={title} animation="fadeUp" delay={index * 25}>
                  <Card className="bg-gradient-to-br from-amber-900/60 to-yellow-800/60 backdrop-blur-sm border-2 border-amber-600/80 hover:border-amber-500/80 transition-colors duration-200 shadow-2xl rounded-lg sm:rounded-xl group h-full">
                    <CardContent className="p-4 sm:p-6 md:p-8 text-center h-full flex flex-col">
                      <div className="bg-amber-800/60 p-3 sm:p-4 rounded-full w-fit mx-auto mb-4 sm:mb-6 group-hover:bg-amber-700/60 transition-colors duration-200 flex-shrink-0">
                        {typeof Icon === "function" ? (
                          <Icon />
                        ) : (
                          <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-amber-100/90" />
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-amber-100 mb-2 sm:mb-4 tracking-tight font-serif flex-shrink-0">
                        {title}
                      </h3>
                      <p className="text-amber-200/70 text-xs sm:text-sm leading-relaxed flex-grow font-bold font-serif">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-amber-900/60 to-yellow-800/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 border-2 border-amber-600/80">
              <div className="mb-4 text-yellow-300 font-bold text-sm sm:text-base font-serif">
                🎵 తెలుగు రాత్రి - A రాత్రి to Remember 🎵
              </div>
              <p className="text-amber-100/70 text-xs sm:text-sm font-bold font-serif">
                © 2025 Telugu రాత్రి Manipal. All rights reserved.
              </p>
              <p className="text-amber-200/50 text-xs mt-2 font-serif">
                Celebrating Telugu culture, music, and community
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}