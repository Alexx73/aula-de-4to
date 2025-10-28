import React, { useRef, useState, useEffect } from "react";
import audioFile from "../assets/dialog1/2_hackers.mp3";
import pdfHackers from "../assets/dialog1/hackers.pdf";

export default function Dialog1() {
  const audioRef = useRef(null);
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeout = useRef(null);

  // 🔧 Tiempo configurable en milisegundos
  const tiempoControles = 4000; // 10 segundos

  // 🎧 Ocultamiento automático con detección de interacción
  const mostrarControlesTemporalmente = () => {
    if (!visible) setVisible(true);
    clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      if (!isHovering) setVisible(false);
    }, tiempoControles);
  };

  useEffect(() => {
    // Movimiento del mouse
    const handleMouseMove = () => {
      mostrarControlesTemporalmente();
    };

    // Click o toque en el PDF
    const handleClick = () => {
      mostrarControlesTemporalmente();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleClick);
      clearTimeout(hideTimeout.current);
    };
  }, [isHovering, visible]);

  // 🎵 Progreso del audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

  const handleSpeedChange = (speed) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setCurrentSpeed(speed);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // ⏱ Formato de tiempo mm:ss
  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className="relative w-full min-h-screen bg-gray-50 overflow-hidden"
      onClick={mostrarControlesTemporalmente}
      onTouchStart={mostrarControlesTemporalmente}
    >
      {/* 📄 PDF a pantalla completa */}
      <object
        data={pdfHackers}
        type="application/pdf"
        className="w-full h-screen"
        aria-label="PDF del diálogo Hackers"
      >
        <p className="text-center mt-10 text-gray-600">
          Tu navegador no puede mostrar el PDF.
          <a
            href={pdfHackers}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline ml-1"
          >
            Haz clic aquí para abrirlo
          </a>
        </p>
      </object>

      {/* 🎚 Panel lateral de controles */}
      <div
        className={`fixed top-1/2 left-0 transform -translate-y-1/2 transition-opacity duration-3000 z-50 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col gap-4 bg-purple-100/80 backdrop-blur-md p-4 pl-5 rounded-r-2xl shadow-2xl border border-purple-200">
          <audio
            ref={audioRef}
            src={audioFile}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* ▶️ Play / Pause */}
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md text-lg font-bold transition-transform hover:scale-105"
          >
            {isPlaying ? "⏸" : "▶️"}
          </button>

          {/* ⚡ Velocidades */}
          {[1, 0.75, 0.5].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                currentSpeed === speed
                  ? "bg-green-500 text-white"
                  : "bg-white text-purple-700 hover:bg-purple-200 border border-purple-300"
              }`}
            >
              {speed}x
            </button>
          ))}

          {/* 🔊 Volumen */}
          <div className="flex flex-col items-center text-xs text-purple-700">
            <span className="mb-1 font-semibold">Volumen</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-purple-600 cursor-pointer"
            />
          </div>

          {/* ⏹ Stop */}
          <button
            onClick={stopAudio}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md text-lg font-bold transition-transform hover:scale-105"
          >
            ⏹
          </button>

          {/* 📈 Progreso */}
          <div className="flex flex-col items-center text-xs text-purple-700 mt-1">
            <span className="font-semibold mb-1">Progreso</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={progress}
              onChange={handleProgressChange}
              className="w-24 accent-green-500 cursor-pointer"
            />
            <div className="text-[10px] mt-1">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
