"use client";

import { useState, useRef, useEffect } from "react";
import { Crop, ZoomIn, RotateCw, Check, X, Frame, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  initialAspectRatio?: "portrait" | "landscape" | "square" | "free";
}

export default function ImageCropperModal({
  imageSrc,
  onCropComplete,
  onCancel,
  initialAspectRatio = "portrait",
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<"portrait" | "landscape" | "square" | "free">(
    initialAspectRatio
  );
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      setImgLoaded(true);
    };
  }, [imageSrc]);

  // Target dimensions based on aspect ratio
  const getTargetRatio = () => {
    switch (aspectRatio) {
      case "portrait":
        return 3 / 4;
      case "landscape":
        return 4 / 3;
      case "square":
        return 1 / 1;
      default:
        return 1;
    }
  };

  const handleApplyCrop = () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const targetRatio = getTargetRatio();
    let cropWidth = img.naturalWidth;
    let cropHeight = img.naturalHeight;

    if (aspectRatio !== "free") {
      if (cropWidth / cropHeight > targetRatio) {
        cropWidth = cropHeight * targetRatio;
      } else {
        cropHeight = cropWidth / targetRatio;
      }
    }

    // High definition output canvas (capped at 1600px for high clarity & reasonable file size)
    const outputWidth = Math.min(1600, Math.round(cropWidth));
    const outputHeight = Math.min(1600, Math.round(cropHeight));

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.save();

    // Move to center of canvas for rotation & zoom
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Apply offset translation
    const sourceX = (img.naturalWidth - cropWidth) / 2 + offsetX * (img.naturalWidth / 100);
    const sourceY = (img.naturalHeight - cropHeight) / 2 + offsetY * (img.naturalHeight / 100);

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      cropWidth,
      cropHeight,
      -outputWidth / 2,
      -outputHeight / 2,
      outputWidth,
      outputHeight
    );

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        setIsProcessing(false);
        if (blob) {
          onCropComplete(blob);
        }
      },
      "image/webp",
      0.9
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* STICKY HEADER */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 shrink-0 flex items-center justify-between bg-neutral-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C9A961]/15 text-[#C9A961] border border-[#C9A961]/30">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading text-base sm:text-lg font-bold text-white leading-tight">
                Editor Potong Gambar (Crop)
              </h3>
              <p className="text-[11px] text-neutral-400 font-light">
                Atur rasio & potong foto agar sesuai dengan tampilan website Prabaswara.
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* Aspect Ratio Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Frame className="w-3.5 h-3.5 text-[#C9A961]" />
              <span>Pilih Rasio Foto (Aspect Ratio)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio("portrait")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  aspectRatio === "portrait"
                    ? "bg-[#C9A961] text-neutral-950 font-bold shadow-md"
                    : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                Portrait (3:4)
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio("landscape")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  aspectRatio === "landscape"
                    ? "bg-[#C9A961] text-neutral-950 font-bold shadow-md"
                    : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                Landscape (4:3)
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio("square")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  aspectRatio === "square"
                    ? "bg-[#C9A961] text-neutral-950 font-bold shadow-md"
                    : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                Square (1:1)
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio("free")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  aspectRatio === "free"
                    ? "bg-[#C9A961] text-neutral-950 font-bold shadow-md"
                    : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                Asli / Bebas
              </button>
            </div>
          </div>

          {/* Canvas Preview Box */}
          <div className="relative bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden flex items-center justify-center p-3 min-h-[220px] max-h-[300px]">
            {!imgLoaded ? (
              <div className="flex flex-col items-center space-y-2 py-8">
                <div className="w-8 h-8 border-2 border-[#C9A961] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-neutral-400">Memuat pratinjau foto...</span>
              </div>
            ) : (
              <div
                className="relative overflow-hidden transition-all duration-300 border-2 border-dashed border-[#C9A961] shadow-2xl flex items-center justify-center max-h-[260px] mx-auto"
                style={{
                  aspectRatio:
                    aspectRatio === "portrait"
                      ? "3/4"
                      : aspectRatio === "landscape"
                      ? "4/3"
                      : aspectRatio === "square"
                      ? "1/1"
                      : "auto",
                }}
              >
                <img
                  src={imageSrc}
                  alt="Crop preview"
                  className="object-cover transition-transform duration-100 max-h-[250px] w-full"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Controls: Zoom Slider & Rotate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-[#C9A961]" /> Perbesar (Zoom):
                </span>
                <span className="font-mono text-white font-semibold">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#C9A961] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#C9A961]" />
                <span>Putar 90°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                  setOffsetX(0);
                  setOffsetY(0);
                }}
                className="px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* STICKY FOOTER ACTION BUTTONS */}
        <div className="p-4 border-t border-neutral-800 shrink-0 bg-neutral-950/90 flex items-center justify-end gap-3 z-10">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? "Memproses Crop..." : "Terapkan Crop & Upload"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
