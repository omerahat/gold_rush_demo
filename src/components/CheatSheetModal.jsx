import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

const CheatSheetModal = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-30 flex items-center justify-center bg-saloon-900/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(event) => event.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border border-amber-700/60 bg-saloon-800/90 p-8 text-amber-100 shadow-saloon"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-saloon-900/70 p-2 text-amber-400 hover:text-amber-100"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-gold-400" />
            <p className="text-2xl font-semibold uppercase tracking-[0.3em]">Cheat Sheet</p>
          </div>
          <p className="mt-4 text-lg text-amber-200">
            Math Tip: Most miners start with <span className="text-gold-400 font-semibold">200 - 350 gold</span>.
            Probe with <span className="text-gold-400 font-semibold">80</span> or <span className="text-gold-400 font-semibold">130</span> to read their reserves.
          </p>
          <p className="mt-6 text-sm text-amber-400">
            Use conservative demands early at the Surface, then push harder once you hit the Deep Mine.
          </p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default CheatSheetModal;
