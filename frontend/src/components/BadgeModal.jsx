import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Howl } from "howler";

export default function BadgeModal({ badge, open, onClose }) {
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (open) {
      // Play a success sound
      const s = new Howl({
        src: ["/assets/sounds/success.mp3"], // Assuming a generic success sound exists, or fail gracefully
        volume: 0.5,
      });
      s.play();
      setSound(s);
    } else {
      if (sound) sound.stop();
    }
    
    return () => {
        if(sound) sound.unload();
    }
  }, [open]);

  if (!badge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-bmLightYellow text-bmBlack border-4 border-bmBlack rounded-2xl shadow-[6px_6px_0_#000] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-bmBlack">
            AWESOME!
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-lexend text-bmBlack mt-2">
            You've earned a new badge!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="w-32 h-32 bg-bmYellow border-2 border-bmBlack rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden animate-bounce-slow">
            {badge.imageUrl ? (
              <img 
                src={badge.imageUrl} 
                alt={badge.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="text-4xl">🏆</span>';
                  e.target.parentNode.classList.remove('bg-bmYellow');
                  e.target.parentNode.classList.add('bg-white');
                }}
              />
            ) : (
              <span className="text-4xl">🏆</span>
            )}
          </div>
          
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold font-spartan text-bmBlack uppercase">{badge.name}</h3>
            <p className="text-bmBlack font-lexend">{badge.description}</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={onClose} 
            size="lg" 
            className="w-full sm:w-auto bg-bmYellow hover:bg-bmOrange hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
