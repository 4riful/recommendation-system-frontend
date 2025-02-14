"use client";

import React, { useCallback, useEffect, useState } from "react";

export function CloudinaryUploadWidget({ children, preset, onUploadSuccess }) {
  const [widget, setWidget] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Dynamically load the Cloudinary widget script if not present
  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Cloudinary widget script");
        setScriptLoaded(false);
      };
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!scriptLoaded) {
      console.warn("Cloudinary widget script is still loading");
      return;
    }
    if (!window.cloudinary) {
      console.error("Cloudinary is not available");
      return;
    }
    // Create and open the widget
    const newWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: preset,
        sources: ["local", "camera", "url"],
        cropping: true,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          onUploadSuccess(result.info.secure_url);
        }
      }
    );
    newWidget.open();
    setWidget(newWidget);
  }, [scriptLoaded, preset, onUploadSuccess]);

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}
