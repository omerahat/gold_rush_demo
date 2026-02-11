import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Coins, Sparkles } from 'lucide-react';

const TurnFeedbackOverlay = ({ visible, action, onAdvance }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="fixed inset-0 z-30 flex items-center justify-center bg-saloon-900/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onAdvance}
      >
        <motion.div
          className={`w-full max-w-xl rounded-3xl border p-10 text-center shadow-saloon ${
            action?.success
              ? 'border-gold-500 bg-saloon-800/90 text-gold-200'
              : 'border-danger-500 bg-saloon-900/90 text-danger-500'
          }`}
          initial={{ scale: 0.85, rotateX: -15 }}
          animate={{ scale: 1, rotateX: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex justify-center pb-6">
            {action?.success ? (
              <Sparkles className="h-16 w-16 text-gold-300" />
            ) : (
              <AlertTriangle className="h-16 w-16 text-danger-500" />
            )}
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Turn Result</p>
          <p className="mt-4 text-4xl font-bold uppercase tracking-[0.5em]">
            {action?.success ? 'Success!' : 'Strike!'}
          </p>
          <p className="mt-3 text-xl text-amber-100">
            {action?.success
              ? `Received ${action.transfer} gold from the opponent.`
              : 'No gold found. You lost a pickaxe!'}
          </p>
          <p className="mt-2 text-lg text-amber-400">Demanded {action?.demand} gold.</p>

          {action?.success && (
            <div className="mt-6 flex items-center justify-center gap-3 text-gold-300">
              <Coins className="h-8 w-8" />
              <p className="text-2xl font-semibold">{action.transfer} Gold Secured</p>
            </div>
          )}

          <p className="mt-8 text-sm text-amber-400">Tap or wait to continue</p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default TurnFeedbackOverlay;
