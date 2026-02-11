import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';

const GameOverScreen = ({ visible, winnerLabel, reason, onRestart }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-saloon-900/95 text-center text-amber-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg rounded-3xl border border-gold-500 bg-saloon-800/90 p-10 shadow-saloon"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Trophy className="mx-auto mb-6 h-16 w-16 text-gold-400" />
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Game Over</p>
          <p className="mt-4 text-4xl font-semibold text-gold-300">{winnerLabel} Wins!</p>
          <p className="mt-2 text-xl text-amber-200">{reason}</p>
          <button
            type="button"
            onClick={onRestart}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold-500 px-6 py-3 text-lg font-semibold uppercase tracking-[0.3em] text-saloon-900 shadow-saloon transition hover:bg-gold-400"
          >
            <RotateCcw className="h-5 w-5" />
            New Game
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default GameOverScreen;
