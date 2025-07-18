"use client"

import { useEffect, useRef, useState } from "react"

export default function GoogleTranslateWidget() {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!visible) return
    if (document.getElementById("google_translate_script")) return
    const script = document.createElement("script")
    script.id = "google_translate_script"
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    script.async = true
    document.body.appendChild(script)

    // @ts-ignore
    window.googleTranslateElementInit = () => {
      if (widgetRef.current) {
        // @ts-ignore
        new window.google.translate.TranslateElement({
          pageLanguage: "en",
          includedLanguages: "hi,kn,ta,te,ml,bn,gu,mr,pa,ur,or,as,sa",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        }, widgetRef.current)
      }
    }
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
      // @ts-ignore
      delete window.googleTranslateElementInit
    }
  }, [visible])

  return (
    <>
      <button
        onClick={() => setVisible((v) => !v)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 9999,
          padding: "0.75rem 1.25rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          cursor: "pointer",
        }}
        aria-label="Translate website"
      >
        🌐 Translate
      </button>
      {visible && (
        <div
          ref={widgetRef}
          style={{
            position: "fixed",
            bottom: 72,
            right: 24,
            zIndex: 9999,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
          }}
        />
      )}
    </>
  )
}
