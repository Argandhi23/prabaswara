"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Crop, ZoomIn, RotateCw, Check, X, RefreshCw, Move, Lock } from "lucide-react";
import { motion } from "framer-motion";

export type CropRatioType = "portrait" | "landscape" | "square" | "free" | "banner";

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  initialAspectRatio?: CropRatioType;
  lockAspectRatio?: boolean;
}

export default function ImageCropperModal({
  imageSrc,
  onCropComplete,
  onCancel,
  initialAspectRatio = "portrait",
  lockAspectRatio = true,
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<CropRatioType>(initialAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 1200, height: 900 });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setImgLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      setNaturalSize({
        width: img.naturalWidth || 1200,
        height: img.naturalHeight || 900,
      });
      setImgLoaded(true);
    };
    img.onerror = () => {
      const img2 = new Image();
      img2.src = imageSrc;
      img2.onload = () => {
        imageRef.current = img2;
        setNaturalSize({
          width: img2.naturalWidth || 1200,
          height: img2.naturalHeight || 900,
        });
        setImgLoaded(true);
      };
      img2.onerror = () => setImgLoaded(true);
    };
  }, [imageSrc]);

  // Dragging Handlers
  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setInitialOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleStartDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const dx = clientX - dragStart.x;
      const dy = clientY - dragStart.y;
      setOffsetX(initialOffset.x + dx);
      setOffsetY(initialOffset.y + dy);
    },
    [isDragging, dragStart, initialOffset]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  // Get preview box pixel dimensions (width & height in DOM)
  const getBoxDimensions = () => {
    if (aspectRatio === "banner") {
      const boxW = 340;
      const boxH = Math.round((340 * 9) / 16); // 191px height
      return { boxW, boxH, ratioStr: "16/9", aspectVal: 16 / 9 };
    }
    if (aspectRatio === "portrait") {
      const boxW = 210;
      const boxH = 280;
      return { boxW, boxH, ratioStr: "3/4", aspectVal: 3 / 4 };
    }
    if (aspectRatio === "landscape") {
      const boxW = 320;
      const boxH = 240;
      return { boxW, boxH, ratioStr: "4/3", aspectVal: 4 / 3 };
    }
    if (aspectRatio === "square") {
      const boxW = 240;
      const boxH = 240;
      return { boxW, boxH, ratioStr: "1/1", aspectVal: 1 };
    }
    const freeVal =
      naturalSize.width > 0 && naturalSize.height > 0
        ? naturalSize.width / naturalSize.height
        : 1;
    const boxW = naturalSize.width >= naturalSize.height ? 320 : Math.round(240 * freeVal);
    const boxH = naturalSize.width >= naturalSize.height ? Math.round(320 / freeVal) : 240;
    return {
      boxW,
      boxH,
      ratioStr: `${naturalSize.width}/${naturalSize.height}`,
      aspectVal: freeVal,
    };
  };

  const { boxW, boxH, ratioStr, aspectVal } = getBoxDimensions();

  // Compute Base Image Size inside Preview Box (accounting for rotation)
  const isRotated90or270 = rotation % 180 !== 0;
  const rotatedNaturalW = isRotated90or270 ? naturalSize.height : naturalSize.width;
  const rotatedNaturalH = isRotated90or270 ? naturalSize.width : naturalSize.height;

  const scaleX = boxW / Math.max(1, rotatedNaturalW);
  const scaleY = boxH / Math.max(1, rotatedNaturalH);
  const baseCoverScale = Math.max(scaleX, scaleY);

  const baseImgW = Math.round(naturalSize.width * baseCoverScale);
  const baseImgH = Math.round(naturalSize.height * baseCoverScale);

  // Canvas Crop & Export Handler
  const handleApplyCrop = () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    const img = imageRef.current;
    const naturalWidth = img.naturalWidth || naturalSize.width;
    const naturalHeight = img.naturalHeight || naturalSize.height;

    let outW = 1600;
    let outH = 900;

    if (aspectRatio === "banner") {
      // 16:9 Standard Banner Ratio (1600x900)
      outW = 1600;
      outH = 900;
    } else if (aspectRatio === "portrait") {
      // 3:4 Standard Photo Card Ratio (1200x1600)
      outW = 1200;
      outH = 1600;
    } else if (aspectRatio === "landscape") {
      outW = 1600;
      outH = 1200;
    } else if (aspectRatio === "square") {
      outW = 1400;
      outH = 1400;
    } else {
      if (naturalWidth >= naturalHeight) {
        outW = Math.min(1600, naturalWidth);
        outH = Math.round(outW / aspectVal);
      } else {
        outH = Math.min(1600, naturalHeight);
        outW = Math.round(outH * aspectVal);
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const screenToCanvas = outW / boxW;

    const canvasBaseScale = baseCoverScale * screenToCanvas;
    const canvasTotalScale = canvasBaseScale * zoom;

    const canvasOffsetX = offsetX * screenToCanvas;
    const canvasOffsetY = offsetY * screenToCanvas;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.translate(outW / 2 + canvasOffsetX, outH / 2 + canvasOffsetY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(canvasTotalScale, canvasTotalScale);

    ctx.drawImage(img, -naturalWidth / 2, -naturalHeight / 2, naturalWidth, naturalHeight);

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        setIsProcessing(false);
        if (blob) {
          onCropComplete(blob);
        }
      },
      "image/webp",
      0.92
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
                {aspectRatio === "banner"
                  ? "Crop Cover Banner Sub-Brand (16:9)"
                  : "Crop Foto Karya Portofolio (3:4)"}
              </h3>
              <p className="text-[11px] text-neutral-400 font-light">
                {aspectRatio === "banner"
                  ? "Rasio 16:9 terkunci pas 100% dengan kartu banner sub-brand. Geser posisi foto agar pas."
                  : "Rasio 3:4 portrait terkunci pas 100% dengan kartu galeri. Geser posisi foto agar pas."}
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
          {/* Automatic Single Locked Ratio Badge */}
          <div className="p-3.5 bg-[#C9A961]/12 border border-[#C9A961]/40 rounded-2xl text-center flex items-center justify-center gap-2.5 shadow-sm">
            <Lock className="w-4 h-4 text-[#C9A961]" />
            <span className="text-xs font-bold text-[#C9A961] uppercase tracking-wider">
              {aspectRatio === "banner"
                ? "Rasio Terkunci Banner Sub-Brand (16:9 Pas Kartu)"
                : "Rasio Terkunci Karya Foto Galeri (3:4 Portrait Pas Kartu)"}
            </span>
          </div>

          {/* Interactive Drag & Preview Box */}
          <div className="relative bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden flex items-center justify-center p-4 min-h-[240px] max-h-[320px]">
            {!imgLoaded ? (
              <div className="flex flex-col items-center space-y-2 py-8">
                <div className="w-8 h-8 border-2 border-[#C9A961] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-neutral-400">Memuat pratinjau foto...</span>
              </div>
            ) : (
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleEndDrag}
                onMouseLeave={handleEndDrag}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleEndDrag}
                className={`relative overflow-hidden transition-all duration-300 border-2 border-dashed border-[#C9A961] shadow-2xl flex items-center justify-center mx-auto select-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  width: `${boxW}px`,
                  height: `${boxH}px`,
                }}
              >
                <img
                  src={imageSrc}
                  alt="Crop preview"
                  draggable={false}
                  className="absolute pointer-events-none max-w-none origin-center"
                  style={{
                    width: `${baseImgW}px`,
                    height: `${baseImgH}px`,
                    transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${zoom})`,
                  }}
                />

                {/* Rule of Thirds Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div />
                </div>

                {/* Drag Hint Badge */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] text-neutral-200 flex items-center gap-1.5 pointer-events-none shadow-md">
                  <Move className="w-3 h-3 text-[#C9A961]" />
                  <span>Klik & Geser Gambar</span>
                </div>
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
