import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Play, Pause, Sparkles, Layers, ChevronDown } from 'lucide-react';
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
  const [detailsOpen, setDetailsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  const currentElement = ELEMENTS[elementIndex];
  const currentMolecule = MOLECULES[moleculeIndex];

  // Pause background cycles when the component is scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMotionReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // 6-second auto-cycle: atoms one-by-one → switch to molecules → back to atoms
  const cycleDuration = 6000;

  useEffect(() => {
    if (!isPlaying || !isVisible) {
      return;
    }
    const intervalStep = 50;
    const stepRatio = (intervalStep / cycleDuration) * 100;
    const interval = window.setInterval(() => {
      setProgress((prev) => Math.min(prev + stepRatio, 100));
    }, intervalStep);
    return () => clearInterval(interval);
  }, [isPlaying, isVisible]);

  useEffect(() => {
    if (!isPlaying || !isVisible || progress < 100) return;
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
  }, [progress, isPlaying, isVisible, mode, elementIndex, moleculeIndex]);

  const handleSelectElement = (idx: number) => {
    setElementIndex(idx);
    setProgress(0);
  };

  const handleSelectMolecule = (idx: number) => {
    setMoleculeIndex(idx);
    setProgress(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[540px] lg:max-w-[580px] xl:max-w-[600px] mx-auto flex flex-col gap-2.5 sm:gap-3"
    >
      {/* 1. TOP CONTROLS BAR: Mode switcher & Play/Pause */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        {/* Mode Switcher: 2 equal segments */}
        <div className="inline-flex flex-1 sm:flex-initial rounded-full p-1 bg-navy-950/80 border border-white/10 backdrop-blur-md shadow-lg">
          <button
            type="button"
            onClick={() => {
              setMode('atom');
              setProgress(0);
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 min-h-[34px] ${
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
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 min-h-[34px] ${
              mode === 'molecule'
                ? 'bg-gradient-to-r from-neon-400 to-accent-400 text-navy-950 shadow-md font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Molekula rejimi</span>
          </button>
        </div>

        {/* Auto-cycle Play/Pause with radial progress ring */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Avtomatik almashtirishni to‘xtatish' : 'Avtomatik almashtirishni yoqish'}
          aria-label={isPlaying ? 'Avtomatik almashtirishni to‘xtatish' : 'Avtomatik almashtirishni yoqish'}
          className="relative w-9 h-9 rounded-full flex items-center justify-center bg-navy-950/80 border border-white/10 text-white/80 hover:text-white hover:border-accent-400/40 transition-colors shadow-lg shrink-0"
        >
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
            <Play className="w-3.5 h-3.5 relative z-10 text-white/70 ml-0.5" />
          )}
        </button>
      </div>

      {/* 2. 3D ATOM / MOLECULE SCENE (CANVAS)
          Unobstructed viewport: nucleus and orbits remain completely visible and centered */}
      <div className="relative w-full h-[min(48svh,340px)] sm:h-[370px] lg:h-[370px] xl:h-[390px] rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl bg-gradient-to-b from-navy-900/40 via-navy-950/60 to-navy-950/80">
        {/* Subtle decorative radial glow behind the atom */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(45,255,176,0.12),transparent_70%)]" />

        <SceneContainer
          mode={mode}
          element={currentElement}
          molecule={currentMolecule}
          motionReduced={motionReduced}
        />
      </div>

      {/* 3. ELEMENT / MOLECULE SELECTOR TOOLBAR
          5 elements (H, C, O, Na, Cl) all visible and accessible with >= 44x44px touch targets.
          No forced scrollIntoView to prevent page jump back to top. */}
      <div className="w-full">
        {mode === 'atom' ? (
          <div className="rounded-2xl glass p-1 sm:p-1.5 border border-white/10 backdrop-blur-xl">
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {ELEMENTS.map((el, idx) => {
                const isActive = elementIndex === idx;
                return (
                  <button
                    key={el.symbol}
                    type="button"
                    onClick={() => handleSelectElement(idx)}
                    className={`relative min-h-[44px] min-w-[42px] py-1 px-1 rounded-xl text-center transition-all duration-300 flex flex-col items-center justify-center touch-manipulation ${
                      isActive
                        ? 'bg-gradient-to-b from-accent-400/25 to-accent-500/10 border border-accent-400/70 shadow-lg shadow-accent-400/20'
                        : 'bg-navy-950/50 border border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`text-base font-heading font-bold leading-none ${
                        isActive ? 'text-accent-300' : 'text-white/85'
                      }`}
                    >
                      {el.symbol}
                    </div>
                    <div className="text-[10px] text-white/50 font-mono mt-0.5 leading-none">
                      Z={el.atomicNumber}
                    </div>

                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="active-element-indicator"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-1 rounded-full bg-accent-400 shadow-[0_0_8px_#2dffb0]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl glass p-1 sm:p-1.5 border border-white/10 backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-1.5">
              {MOLECULES.map((mol, idx) => {
                const isActive = moleculeIndex === idx;
                return (
                  <button
                    key={mol.id}
                    type="button"
                    onClick={() => handleSelectMolecule(idx)}
                    className={`relative min-h-[44px] min-w-[44px] py-1.5 px-2 rounded-xl text-center transition-all duration-300 flex flex-col items-center justify-center touch-manipulation ${
                      isActive
                        ? 'bg-gradient-to-b from-neon-400/25 to-accent-400/10 border border-neon-400/60 shadow-lg shadow-neon-400/20'
                        : 'bg-navy-950/50 border border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`text-sm sm:text-base font-heading font-bold leading-tight ${
                        isActive ? 'text-neon-300' : 'text-white/85'
                      }`}
                    >
                      {mol.formula}
                    </div>
                    <div className="text-[10px] text-gold-400 font-mono mt-0.5 leading-none">
                      {mol.bondAngle}
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-molecule-indicator"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-1 rounded-full bg-neon-400 shadow-[0_0_8px_#38bdf8]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. SCIENTIFIC ELEMENT / MOLECULE INFORMATION CARD
          Normal document flow below the selector, completely separated from the 3D canvas */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {mode === 'atom' ? (
            <motion.div
              key={`card-atom-${currentElement.symbol}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl glass p-3 sm:p-3.5 border border-white/15 shadow-xl backdrop-blur-xl"
            >
              {/* Header: Symbol & Multilingual Names */}
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-heading text-lg font-bold shadow-lg border border-white/20 shrink-0"
                    style={{
                      backgroundColor: `${currentElement.color}22`,
                      color: currentElement.color,
                      boxShadow: `0 0 14px ${currentElement.glowColor}44`,
                    }}
                  >
                    {currentElement.symbol}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide leading-tight">
                      {currentElement.name[lang] || currentElement.name.uz}
                    </h4>
                    <p className="text-[10.5px] text-white/50 leading-tight mt-0.5">
                      {currentElement.name.uz} • {currentElement.name.en} • {currentElement.name.ru}
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <span className="hidden xs:inline-block px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-white/5 border border-white/10 text-accent-300">
                  {currentElement.category[lang] || currentElement.category.uz}
                </span>
              </div>

              {/* Physical Quantities: Z, Ar, Neutrons */}
              <div className="mt-2.5 pt-2 border-t border-white/10 grid grid-cols-3 gap-1.5 text-center">
                <div className="rounded-lg bg-navy-950/60 p-1 border border-white/5">
                  <div className="text-[9.5px] text-accent-400 font-semibold">Z (p⁺)</div>
                  <div className="text-xs sm:text-sm font-bold text-white font-mono">{currentElement.atomicNumber}</div>
                </div>
                <div className="rounded-lg bg-navy-950/60 p-1 border border-white/5">
                  <div className="text-[9.5px] text-gold-400 font-semibold">Ar</div>
                  <div className="text-xs sm:text-sm font-bold text-white font-mono">{currentElement.atomicMass}</div>
                </div>
                <div className="rounded-lg bg-navy-950/60 p-1 border border-white/5">
                  <div className="text-[9.5px] text-neon-400 font-semibold">N (n⁰)</div>
                  <div className="text-xs sm:text-sm font-bold text-white font-mono">{currentElement.neutrons}</div>
                </div>
              </div>

              {/* Electron Shells distribution: [K, L, M] */}
              <div className="mt-2 flex items-center justify-between text-xs bg-white/5 rounded-lg px-2.5 py-1 border border-white/5">
                <span className="text-white/70 flex items-center gap-1 font-medium text-[11px]">
                  <Layers className="w-3 h-3 text-accent-400" />
                  Qavatlar (e⁻):
                </span>
                <span className="font-mono font-bold text-accent-300 text-[11px]">
                  {currentElement.shells.map((count, i) => `${['K', 'L', 'M'][i] || i + 1}:${count}`).join(' | ')}
                </span>
              </div>

              {/* Expandable Accordion for deeper chemical details */}
              <div className="mt-1.5 pt-1.5 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="w-full flex items-center justify-between text-[10.5px] text-white/60 hover:text-white transition-colors py-0.5"
                >
                  <span className="font-medium">
                    {detailsOpen ? 'Qisqartirish' : 'Batafsil ma’lumot'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      detailsOpen ? 'rotate-180 text-accent-400' : ''
                    }`}
                  />
                </button>

                {detailsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-2 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between bg-navy-950/50 p-2 rounded-lg border border-white/5 font-mono text-[11px]">
                      <span className="text-white/60">Elektron konfiguratsiyasi:</span>
                      <span className="text-accent-300 font-bold">{currentElement.electronConfig}</span>
                    </div>

                    <div className="flex items-center justify-between bg-navy-950/50 p-2 rounded-lg border border-white/5 text-[11px]">
                      <span className="text-white/60">Valentligi:</span>
                      <span className="text-gold-400 font-bold">{currentElement.valency}</span>
                    </div>

                    <p className="text-[11px] text-white/70 leading-relaxed bg-navy-950/40 p-2.5 rounded-lg border border-white/5">
                      {currentElement.description[lang] || currentElement.description.uz}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`card-molecule-${currentMolecule.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl glass p-3 sm:p-3.5 border border-white/15 shadow-xl backdrop-blur-xl"
            >
              {/* Molecule Formula & Name */}
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-heading text-base font-bold bg-neon-400/20 text-neon-300 border border-neon-400/40 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0">
                    {currentMolecule.formula}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {currentMolecule.name[lang] || currentMolecule.name.uz}
                    </h4>
                    <p className="text-[10.5px] text-white/50 mt-0.5">
                      {currentMolecule.name.uz} • {currentMolecule.name.en} • {currentMolecule.name.ru}
                    </p>
                  </div>
                </div>

                {/* Bond Angle Badge */}
                <div className="flex flex-col items-end">
                  <span className="text-[9.5px] text-white/50">Bog‘ burchagi</span>
                  <span className="text-xs font-heading font-extrabold text-gold-400 px-2 py-0.5 rounded-md bg-gold-400/10 border border-gold-400/30">
                    {currentMolecule.bondAngle}
                  </span>
                </div>
              </div>

              {/* Geometry and Molar mass */}
              <div className="mt-2.5 pt-2 border-t border-white/10 grid grid-cols-2 gap-1.5 text-center text-xs">
                <div className="rounded-lg bg-navy-950/60 p-1.5 border border-white/5">
                  <div className="text-[9.5px] text-white/50">Fazoviy shakli</div>
                  <div className="font-semibold text-accent-300 truncate mt-0.5 text-xs">
                    {currentMolecule.geometry[lang] || currentMolecule.geometry.uz}
                  </div>
                </div>
                <div className="rounded-lg bg-navy-950/60 p-1.5 border border-white/5">
                  <div className="text-[9.5px] text-white/50">Molyar massa</div>
                  <div className="font-semibold text-white font-mono mt-0.5 text-xs">
                    {currentMolecule.molarMass}
                  </div>
                </div>
              </div>

              {/* Expandable Accordion for molecule details */}
              <div className="mt-1.5 pt-1.5 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="w-full flex items-center justify-between text-[10.5px] text-white/60 hover:text-white transition-colors py-0.5"
                >
                  <span className="font-medium">
                    {detailsOpen ? 'Qisqartirish' : 'Batafsil ma’lumot'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      detailsOpen ? 'rotate-180 text-neon-400' : ''
                    }`}
                  />
                </button>

                {detailsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-2 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between bg-navy-950/50 p-2 rounded-lg border border-white/5 text-[11px]">
                      <span className="text-white/60">Bog‘lanish turi:</span>
                      <span className="text-neon-300 font-semibold">
                        {currentMolecule.bondType[lang] || currentMolecule.bondType.uz}
                      </span>
                    </div>

                    <p className="text-[11px] text-white/70 leading-relaxed bg-navy-950/40 p-2.5 rounded-lg border border-white/5">
                      {currentMolecule.description[lang] || currentMolecule.description.uz}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
