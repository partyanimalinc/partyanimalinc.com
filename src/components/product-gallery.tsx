"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ProductImagePlaceholder } from "@/components/product-image-placeholder";
import Image from "next/image";

// Product image gallery: large active image + thumbnail strip. Clicking the
// main image opens a full-size lightbox (Escape / arrow keys / backdrop close),
// the standard ecommerce PDP behavior. Client so the user can switch/zoom.
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const main = images[active];
  const count = images.length;

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + count) % count),
    [count],
  );

  // Open the lightbox at a specific image (used by every desktop tile).
  const openAt = useCallback((i: number) => {
    setActive(i);
    setOpen(true);
  }, []);

  // Keyboard controls + body-scroll lock while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go]);

  return (
    <div className="flex flex-col gap-4">
      {images.length === 0 ? (
        <div className="aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          <ProductImagePlaceholder />
        </div>
      ) : (
        <>
          {/* Desktop: scrolling tiled gallery — a full-width hero followed by
              2-up rows. Every image is click-to-zoom into the lightbox. */}
          <div className="hidden grid-cols-2 gap-3 lg:grid">
            {images.map((img, i) => (
              <button
                key={`d-${i}-${img}`}
                type="button"
                onClick={() => openAt(i)}
                aria-label={`View image ${i + 1} larger`}
                className={`group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm ${
                  i === 0 ? "col-span-2" : ""
                }`}
              >
                <Image
                  src={img}
                  alt={i === 0 ? alt : ""}
                  width={700}
                  height={700}
                  className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03] ${
                    i === 0 ? "p-10" : "p-6"
                  }`}
                />
                {/* zoom hint (reveals on hover) */}
                <span
                  aria-hidden
                  className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            ))}
          </div>

          {/* Mobile/tablet: main image + thumbnail switcher */}
          <div className="flex flex-col gap-4 lg:hidden">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="View larger image"
                className="group block h-full w-full cursor-zoom-in"
              >
                <Image src={main} alt={alt} width={800} height={800} className="h-full w-full object-contain p-6" />
                {/* zoom hint */}
                <span
                  aria-hidden
                  className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-white opacity-80 shadow-md transition-opacity group-hover:opacity-100"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.slice(0, 10).map((img, i) => (
                  <button
                    key={`m-${i}-${img}`}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === active}
                    className={`aspect-square overflow-hidden rounded-lg border bg-white transition-colors ${
                      i === active ? "border-brand-red ring-1 ring-brand-red" : "border-black/10 hover:border-black/40"
                    }`}
                  >
                    <Image src={img} alt="" width={160} height={160} className="h-full w-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {open && main && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.9)",
            padding: "clamp(1rem, 4vw, 3rem)",
          }}
        >
          {/* close */}
          <button
            ref={closeRef}
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            aria-label="Close"
            style={{
              position: "absolute", top: "1rem", right: "1rem",
              display: "grid", placeItems: "center", height: "2.75rem", width: "2.75rem",
              borderRadius: "9999px", background: "rgba(255,255,255,0.12)", color: "#fff",
              cursor: "pointer", border: "none",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              aria-label="Previous image"
              style={{
                position: "absolute", left: "clamp(0.5rem, 2vw, 2rem)", top: "50%", transform: "translateY(-50%)",
                display: "grid", placeItems: "center", height: "3rem", width: "3rem",
                borderRadius: "9999px", background: "rgba(255,255,255,0.12)", color: "#fff",
                cursor: "pointer", border: "none",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={main}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "min(92vw, 1100px)",
              maxHeight: "88vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              background: "#fff",
              borderRadius: "0.75rem",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              cursor: "default",
            }}
          />

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label="Next image"
              style={{
                position: "absolute", right: "clamp(0.5rem, 2vw, 2rem)", top: "50%", transform: "translateY(-50%)",
                display: "grid", placeItems: "center", height: "3rem", width: "3rem",
                borderRadius: "9999px", background: "rgba(255,255,255,0.12)", color: "#fff",
                cursor: "pointer", border: "none",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {count > 1 && (
            <span
              aria-hidden
              style={{
                position: "absolute", bottom: "1.25rem", left: "50%", transform: "translateX(-50%)",
                color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", letterSpacing: "0.02em",
              }}
            >
              {active + 1} / {count}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
