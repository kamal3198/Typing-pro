import React, { createContext, useContext, useState, useEffect } from 'react';

const SoundContext = createContext<any>(null);

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => {
    const saved = localStorage.getItem('sound');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sound', JSON.stringify(isSoundOn));
  }, [isSoundOn]);

  const toggleSound = () => setIsSoundOn(!isSoundOn);

  const playSound = (soundType: string) => {
    if (!isSoundOn) return;
    // Implement sound playing logic here
    // For now, just console.log
    console.log(`Playing ${soundType} sound`);
  };

  return (
    <SoundContext.Provider value={{ isSoundOn, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};
