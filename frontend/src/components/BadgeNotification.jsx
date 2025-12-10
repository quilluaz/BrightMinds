import React, { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import BadgeModal from "./BadgeModal";
import { useLocation } from "react-router-dom";

export default function BadgeNotification() {
  const [currentBadge, setCurrentBadge] = useState(null);
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const knownBadgeIdsRef = useRef(new Set());
  const initialLoadCompleteRef = useRef(false);
  const lastUserIdRef = useRef(null);
  const location = useLocation();

  // Poll interval in milliseconds (e.g., 10 seconds)
  const POLL_INTERVAL = 10000;

  // Fetch badges and check for new ones
  const checkBadges = async () => {
    // Only proceed if user is logged in
    const userString = localStorage.getItem("bm_user");
    if (!userString) return;
    
    const user = JSON.parse(userString);
    if (!user?.userId) return;

    // Reset state if user has changed (e.g. logout/login without refresh)
    if (lastUserIdRef.current !== user.userId) {
        knownBadgeIdsRef.current.clear();
        initialLoadCompleteRef.current = false;
        lastUserIdRef.current = user.userId;
    }

    try {
      // Use the 'with-badge' endpoint to get full details
      const response = await api.get(`/user-badges/user/${user.userId}`);
      const userBadges = response.data;

      // First load for this user: just populate known IDs, don't notify (historic badges)
      if (!initialLoadCompleteRef.current) {
        userBadges.forEach((ub) => {
           if (ub.badge && ub.badge.badgeId) {
               knownBadgeIdsRef.current.add(ub.badge.badgeId);
           }
        });
        initialLoadCompleteRef.current = true;
        return;
      }

      // Subsequent loads: check for new IDs
      const newBadges = [];
      userBadges.forEach((ub) => {
        if (ub.badge && ub.badge.badgeId) {
          if (!knownBadgeIdsRef.current.has(ub.badge.badgeId)) {
            // Found a new badge!
            knownBadgeIdsRef.current.add(ub.badge.badgeId);
            newBadges.push(ub.badge);
          }
        }
      });

      if (newBadges.length > 0) {
        // Add new badges to queue
        setBadgeQueue((prev) => [...prev, ...newBadges]);
      }
    } catch (error) {
      console.error("Error checking for badges:", error);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    checkBadges();
  }, []); // Run once on mount to establish baseline

  // Polling effect & Event Listener
  useEffect(() => {
    // 1. Set up polling
    const intervalId = setInterval(() => {
      // Only poll if tab is visible to save resources
      if (document.visibilityState === "visible") {
        checkBadges();
      }
    }, POLL_INTERVAL);

    // 2. Set up event listener for immediate checks (e.g. game completion)
    const handleImmediateCheck = () => {
        console.log("BadgeNotification: Immediate check triggered via event");
        checkBadges();
    };
    window.addEventListener('badge-check', handleImmediateCheck);

    return () => {
        clearInterval(intervalId);
        window.removeEventListener('badge-check', handleImmediateCheck);
    };
  }, []);

  // Process queue
  useEffect(() => {
    if (!isOpen && badgeQueue.length > 0) {
      const nextBadge = badgeQueue[0];
      setCurrentBadge(nextBadge);
      setIsOpen(true);
      // Remove from queue
      setBadgeQueue((prev) => prev.slice(1));
    }
  }, [isOpen, badgeQueue]);

  const handleClose = () => {
    setIsOpen(false);
    setCurrentBadge(null);
  };

  // Don't render anything if no badge to show
  return (
    <BadgeModal 
      badge={currentBadge} 
      open={isOpen} 
      onClose={handleClose} 
    />
  );
}
