"use client";

import { useEffect } from "react";

type ViewTrackerProps = {
  productId: string;
};

export default function ViewTracker({ productId }: ViewTrackerProps) {
  useEffect(() => {
    const track = async () => {
      try {
        await fetch("/api/user/track/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      } catch (err) {
        console.error("Failed to track view", err);
      }
    };

    track();
  }, [productId]);

  // Nothing to render, it just tracks
  return null;
}
