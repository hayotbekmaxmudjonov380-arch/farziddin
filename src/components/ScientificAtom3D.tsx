import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Play, Pause, Sparkles, Layers } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { ELEMENTS, MOLECULES } from './3d/chemistryData';
import SceneContainer from './3d/SceneContainer';

export default function ScientificAtom3D() {
  const { lang } = useI18n();
  const [mode, setMode] = useState<'atom' | 'molecule'>('atom');
  const [elementIndex, setElementIndex] = useState(0);
  const [moleculeIndex, setMoleculeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [motionReduced, setMotionReduced] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentElement = ELEMENTS[elementIndex];
  const currentMolecule = MOLECULES[moleculeIndex];

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMotionReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // 6-second auto-cycle: atoms one-by-one → switch to molecules → back to atoms (loops forever)
  const cycleDuration = 6000;

  // Ticker: fills the progress ring every 6s
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }
    const intervalStep = 50;
    const stepRatio = (intervalStep / cycleDuration) * 100;
    const interval = window.setInterval(() => {
      setProgress((prev) => Math.min(prev + stepRatio, 100));
    }, intervalStep);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Watcher: when one full cycle completes — advance the list, or switch mode at the end
  useEffect(() => {
    if (!isPlaying || progress < 100) return;
    if (mode === 'atom') {
      if (elementIndex >= ELEMENTS.length - 1) {
        setMode('molecule');
        setMoleculeIndex(0);
      } else {
        setElementIndex(elementIndex + 1);
      }
    } else {
      if (moleculeIndex >= MOLECULES.length - 1) {
        setMode('atom');
        setElementIndex(0);
      } else {
        setMoleculeIndex(moleculeIndex + 1);
      }
    }
    setProgress(0);
  }, [progress, isPlaying, mode, elementIndex, moleculeIndex]);

  const handleSelectElement = (idx: number) => {
    setElementIndex(idx);
    setProgress(0);
  };

  const handleSelectMolecule = (idx: number) => {
    setMoleculeIndex(idx);
    setProgress(0);
  };

  return (
    <div className="relative w-full max-w-[580px]">
      {/* FREE 3D SCENE — floats on the page dashboard, larger than the card.
          A radial mask fades everything before the canvas edge, so orbit lines
          dissolve instead of being cut off at the rectangle boundary. */}
      <div
        className="pointer-events-auto absolute left-1/2 top-1/2 z-0 h-[140%] w-[150%] -translate-x-1/2 -translate-y-1/2 sm:h-[170%] sm:w-[180%]"
        style={{
          maskImage: 'radial-gradient(ellipse 68% 68% at 50% 50%, black 52%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 68% 68% at 50% 50%, black 52%, transparent 100%)',
        }}
      >
        <SceneContainer
          mode={mode}
          element={currentElement}
          molecule={currentMolecule}
          motionReduced={motionReduced}
        />
      </div>

      {/* CONTROLS LAYER — frameless floating UI above the free 3D scene (no card, no border, no glow) */}
      <div className="pointer-events-none relative z-10 flex h-[460px] sm:h-[600px] lg:h-[630px] flex-col justify-between p-4 sm:p-5">

        {/* TOP CONTROLS BAR */}
        <div className="pointer-events-auto relative z-20 flex flex-wrap items-center justify-between gap-2.5">
        {/* Mode Switcher: Atom vs Molecule */}
        <div className="inline-flex rounded-full p-1 bg-navy-950/80 border border-white/10 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setMode('atom');
              setProgress(0);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              mode === 'atom'
                ? 'bg-gradient-to-r from-accent-400 to-accent-500 text-navy-950 shadow-md font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Atom modeli</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('molecule');
              setProgress(0);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              mode === 'molecule'
                ? 'bg-gradient-to-r from-neon-400 to-accent-400 text-navy-950 shadow-md font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Molekula rejimi</span>
          </button>
        </div>

        {/* Right Buttons: Play/Pause */}
        <div className="flex items-center gap-2">
          {/* Auto-cycle Play/Pause — works in both atom & molecule modes */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Avtomatik almashtirishni to‘xtatish' : 'Avtomatik almashtirishni yoqish'}
            className="relative p-2 rounded-full bg-navy-950/80 border border-white/10 text-white/80 hover:text-white hover:border-accent-400/40 transition-colors"
          >
            {/* Radial countdown ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5">
              <circle
                cx="50%"
                cy="50%"
                r="14"
                fill="none"
                stroke="rgba(45, 255, 176, 0.15)"
                strokeWidth="2"
              />
              {isPlaying && (
                <circle
                  cx="50%"
                  cy="50%"
                  r="14"
                  fill="none"
                  stroke="#2dffb0"
                  strokeWidth="2"
                  strokeDasharray={88}
                  strokeDashoffset={88 - (88 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-75"
                />
              )}
            </svg>
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 relative z-10 text-accent-400" />
            ) : (
              <Play className="w-3.5 h-3.5 relative z-10 text-white/60 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* FLOATING GLASSMORPHISM SCIENTIFIC BADGE (Top-Left overlay) */}
      <div className="relative z-20 pointer-events-none mt-2">
        <AnimatePresence mode="wait">
          {mode === 'atom' ? (
            <motion.div
              key={`badge-atom-${currentElement.symbol}`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-auto inline-block max-w-[280px] sm:max-w-xs rounded-2xl glass p-3.5 border border-white/15 shadow-xl backdrop-blur-xl"
            >
              {/* Header: Symbol & 3-language Names */}
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-heading text-xl font-bold shadow-lg border border-white/20"
                  style={{
                    backgroundColor: `${currentElement.color}22`,
                    color: currentElement.color,
                    boxShadow: `0 0 16px ${currentElement.glowColor}44`,
                  }}
                >
                  {currentElement.symbol}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    {currentElement.name[lang] || currentElement.name.uz}
                  </h4>
                  <p className="text-[11px] text-white/50 leading-tight">
                    {currentElement.name.uz} • {currentElement.name.en} • {currentElement.name.ru}
                  </p>
                </div>
              </div>

              {/* Physical Quantities: Z, Ar, Neutrons */}
              <div className="mt-2.5 pt-2 border-t border-white/10 grid grid-cols-3 gap-1.5 text-center">
                <div className="rounded-lg bg-navy-950/60 p-1 border border-white/5">
                  <div className="text-[10px] text-accent-400 font-semibold">Z (p⁺)</div>
                  <div className="text-xs font-bold text-white">{currentElement.atomicNumber}</div>
                </div>
                <div className="rounded-lg bg-navy-950/60 p-1 border border-white/5">
                  <div className="text-[10px] text-gold-400 font-semibold">Ar</div>
                  <div className="text-xs font-bold text-white">{currentElement.atomicMass}</div>
                </div>
                <div className="rounded-lg bg-navy-950/60 p-1 border border-white/5">
                  <div className="text-[10px] text-neon-400 font-semibold">N (n⁰)</div>
                  <div className="text-xs font-bold text-white">{currentElement.neutrons}</div>
                </div>
              </div>

              {/* Electron Shells distribution: [K, L, M] */}
              <div className="mt-2 flex items-center justify-between text-[11px] bg-white/5 rounded-lg px-2.5 py-1 border border-white/5">
                <span className="text-white/60 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-accent-400" />
                  Qavatlar (e⁻):
                </span>
                <span className="font-mono font-bold text-accent-300">
                  {currentElement.shells.map((count, i) => `${['K', 'L', 'M'][i] || i + 1}:${count}`).join(' | ')}
                </span>
              </div>

              {/* Electron Configuration */}
              <div className="mt-1 text-[10px] font-mono text-white/70 text-right">
                {currentElement.electronConfig}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`badge-molecule-${currentMolecule.id}`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-auto inline-block max-w-[280px] sm:max-w-xs rounded-2xl glass p-3.5 border border-white/15 shadow-xl backdrop-blur-xl"
            >
              {/* Molecule Formula & Name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-11 rounded-xl flex items-center justify-center font-heading text-lg font-bold bg-neon-400/20 text-neon-300 border border-neon-400/40 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                  {currentMolecule.formula}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {currentMolecule.name[lang] || currentMolecule.name.uz}
                  </h4>
                  <p className="text-[11px] text-white/50">
                    {currentMolecule.name.uz} • {currentMolecule.name.en} • {currentMolecule.name.ru}
                  </p>
                </div>
              </div>

              {/* Real Scientific Bond Angle Highlight */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/60">Haqiqiy bog‘ burchagi:</span>
                <span className="text-sm font-heading font-extrabold text-gold-400 px-2 py-0.5 rounded-md bg-gold-400/10 border border-gold-400/30">
                  {currentMolecule.bondAngle}
                </span>
              </div>

              {/* Geometry and Molar mass */}
              <div className="mt-2 grid grid-cols-2 gap-1.5 text-center text-[10px]">
                <div className="rounded-lg bg-navy-950/60 p-1.5 border border-white/5">
                  <div className="text-white/50">Fazoviy shakli</div>
                  <div className="font-semibold text-accent-300 truncate">
                    {currentMolecule.geometry[lang] || currentMolecule.geometry.uz}
                  </div>
                </div>
                <div className="rounded-lg bg-navy-950/60 p-1.5 border border-white/5">
                  <div className="text-white/50">Molyar massa</div>
                  <div className="font-semibold text-white font-mono">
                    {currentMolecule.molarMass}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM SELECTOR TOOLBAR */}
      <div className="pointer-events-auto relative z-20 mt-auto pt-2">
        {mode === 'atom' ? (
          /* Elements Selector: H, C, O, Na, Cl */
          <div className="rounded-2xl glass p-2 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-1.5 sm:gap-2">
              {ELEMENTS.map((el, idx) => {
                const isActive = elementIndex === idx;
                return (
                  <button
                    key={el.symbol}
                    type="button"
                    onClick={() => handleSelectElement(idx)}
                    className={`relative flex-1 py-1.5 px-1 sm:px-2 rounded-xl text-center transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-b from-accent-400/30 to-accent-500/10 border border-accent-400/60 shadow-lg shadow-accent-400/20'
                        : 'bg-navy-950/40 border border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`text-sm sm:text-base font-heading font-bold ${
                        isActive ? 'text-accent-300' : 'text-white/80'
                      }`}
                    >
                      {el.symbol}
                    </div>
                    <div className="text-[10px] text-white/45 hidden sm:block font-mono">
                      Z={el.atomicNumber}
                    </div>

                    {/* Active element indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="active-element-pill"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-accent-400 shadow-[0_0_8px_#2dffb0]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Molecules Selector: H2O, CH4, CO2 */
          <div className="rounded-2xl glass p-2 border border-white/10 backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-2">
              {MOLECULES.map((mol, idx) => {
                const isActive = moleculeIndex === idx;
                return (
                  <button
                    key={mol.id}
                    type="button"
                    onClick={() => handleSelectMolecule(idx)}
                    className={`relative py-2 px-2 rounded-xl text-center transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-b from-neon-400/25 to-accent-400/10 border border-neon-400/50 shadow-lg shadow-neon-400/20'
                        : 'bg-navy-950/40 border border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`text-sm sm:text-base font-heading font-bold ${
                        isActive ? 'text-neon-300' : 'text-white/80'
                      }`}
                    >
                      {mol.formula}
                    </div>
                    <div className="text-[10px] text-gold-400 font-mono">
                      {mol.bondAngle}
                    </div>

                    {/* Active molecule indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-molecule-pill"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-neon-400 shadow-[0_0_8px_#38bdf8]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
