
"use client";

import { useEffect } from "react";

export default function LanguageSwitcher() {
  useEffect(() => {
    window.gtranslateSettings = {
      default_language: "en",
      languages: ["en", "bn"],
      wrapper_selector: ".gtranslate_wrapper",
    };

    if (document.querySelector("[data-gtranslate]")) return;

    const script = document.createElement("script");
    script.src =
      "https://cdn.gtranslate.net/widgets/latest/dropdown.js";
    script.defer = true;
    script.setAttribute("data-gtranslate", "true");

    document.body.appendChild(script);

    return () => {
      // Keep the script loaded during navigation.
    };
  }, []);

  return <div className="gtranslate_wrapper" />;
}
