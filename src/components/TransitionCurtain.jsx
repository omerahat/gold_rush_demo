import { motion, AnimatePresence } from 'framer-motion';
import { Handshake, Shield } from 'lucide-react';

const TransitionCurtain = ({ visible, nextPlayerLabel, onReady }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-saloon-900/95 text-center text-amber-100 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Shield className="mb-6 h-16 w-16 text-gold-400" />
        <p className="text-sm uppercase tracking-[0.5em] text-amber-500">Hot-Seat Swap</p>
        <p className="mt-4 text-4xl font-semibold">Pass the device to {nextPlayerLabel}</p>
        <p className="mt-2 text-lg text-amber-300">No peeking! This curtain keeps the gold totals secret.</p>
        <button
          type="button"
          onClick={onReady}
          className="mt-10 flex items-center gap-3 rounded-full bg-gold-500/90 px-6 py-3 text-xl font-semibold uppercase tracking-[0.3em] text-saloon-900 shadow-saloon transition hover:bg-gold-400"
        >
          <Handshake className="h-6 w-6" />
          Ready
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

export default TransitionCurtain;
