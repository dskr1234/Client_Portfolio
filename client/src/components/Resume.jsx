import React, { useState } from "react"
import Section from "./Section"

const PREVIEW_SRC = "/Resume.jpg"      // <-- your preview image
const PDF_SRC = "/Upendra Dommaraju - ComputerScienceGraduate.pdf"          // <-- actual downloadable PDF
const DOWNLOAD_NAME = "Upendra_Dommaraju_Resume.pdf"  // file name on download

export default function Resume(){
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <Section id="education" title="Resume">
      <div className="space-y-5">
        {/* Card */}
        <div className="soft-2 rounded-[24px] neo p-4 md:p-6">
          {/* Skeleton while loading */}
          {!loaded && !error && (
            <div className="w-full aspect-[8.5/11] rounded-[20px] bg-white/5 animate-pulse" />
          )}

          {/* Preview Image */}
          {!error && (
            <img
              src={PREVIEW_SRC}
              alt="Resume preview"
              className={`w-full rounded-[20px] object-cover ${loaded ? 'block' : 'hidden'}`}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              loading="eager"
            />
          )}

          {/* Fallback if image missing */}
          {error && (
            <div className="w-full aspect-[8.5/11] rounded-[20px] bg-white/5 flex items-center justify-center text-rose-300">
              Preview image not found. Place <code>resume-preview.jpg</code> in <code>client/public</code>.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={PDF_SRC}
            download={DOWNLOAD_NAME}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold shadow-lg hover:brightness-110 transition"
          >
            Download PDF
          </a>
          <a
            href={PDF_SRC}
            target="_blank"
            rel="noreferrer"
            className="pill bg-white/10 text-white/90 hover:text-white"
          >
            Open in new tab
          </a>
        </div>
      </div>
    </Section>
  )
}
