import { useEffect, useMemo, useReducer, useState } from 'react';
import {
  initializeGame,
  initialPlayerState,
  getZoneData,
  validateDemand,
  resolveDemand,
  TURN_PHASES,
} from '../lib/GameLogic';
import HUD from './HUD';
import OpponentDisplay from './OpponentDisplay';
import PlayerDisplay from './PlayerDisplay';
import TurnFeedbackOverlay from './TurnFeedbackOverlay';
import TransitionCurtain from './TransitionCurtain';
import CheatSheetModal from './CheatSheetModal';
import GameOverScreen from './GameOverScreen';
import { Lightbulb } from 'lucide-react';

const PLAYER_LABELS = {
  player1: 'Player 1',
  player2: 'Player 2',
};

const createInitialState = () => {
  const { player1Gold, player2Gold } = initializeGame();
  return {
    phase: TURN_PHASES.PLAYER_1_TURN,
    player1: initialPlayerState(player1Gold),
    player2: initialPlayerState(player2Gold),
    round: 1,
    lastAction: null,
    feedbackPlayer: null,
    nextPlayerToAct: 2,
    pendingGameOver: null,
    gameOver: null,
  };
};

const goldRushReducer = (state, action) => {
  switch (action.type) {
    case 'RESOLVE_DEMAND': {
      const { activeKey, demand } = action.payload;
      const opponentKey = activeKey === 'player1' ? 'player2' : 'player1';
      const demandResult = resolveDemand(demand, state[activeKey].gold, state[opponentKey].gold);

      const updatedActive = {
        ...state[activeKey],
        gold: demandResult.newActiveGold,
      };
      const updatedOpponent = {
        ...state[opponentKey],
        gold: demandResult.newOpponentGold,
      };

      let pendingGameOver = null;

      if (!demandResult.success) {
        updatedActive.pickaxes = Math.max(0, updatedActive.pickaxes - 1);
        if (updatedActive.pickaxes <= 0) {
          pendingGameOver = {
            winnerKey: opponentKey,
            reason: 'Bankrupt - three strikes busted the pickaxes.',
          };
        }
      } else if (updatedOpponent.gold <= 0) {
        pendingGameOver = {
          winnerKey: activeKey,
          reason: 'Domination - opponent lost every last nugget.',
        };
      }

      return {
        ...state,
        [activeKey]: updatedActive,
        [opponentKey]: updatedOpponent,
        lastAction: {
          success: demandResult.success,
          strike: !demandResult.success,
          demand,
          transfer: demandResult.transfer,
          activeKey,
          opponentKey,
        },
        feedbackPlayer: activeKey === 'player1' ? 1 : 2,
        nextPlayerToAct: opponentKey === 'player1' ? 1 : 2,
        pendingGameOver,
        phase: TURN_PHASES.TURN_FEEDBACK,
      };
    }
    case 'COMPLETE_FEEDBACK': {
      if (state.pendingGameOver) {
        return {
          ...state,
          phase: TURN_PHASES.GAME_OVER,
          gameOver: {
            winnerKey: state.pendingGameOver.winnerKey,
            winnerLabel: PLAYER_LABELS[state.pendingGameOver.winnerKey],
            reason: state.pendingGameOver.reason,
          },
          pendingGameOver: null,
        };
      }

      // Hot-seat curtain keeps gold totals private between players.
      return {
        ...state,
        phase: TURN_PHASES.TRANSITION_SCREEN,
      };
    }
    case 'READY_NEXT_PLAYER': {
      if (state.phase !== TURN_PHASES.TRANSITION_SCREEN) {
        return state;
      }
      const nextKey = state.nextPlayerToAct === 1 ? 'player1' : 'player2';
      const nextPhase = nextKey === 'player1' ? TURN_PHASES.PLAYER_1_TURN : TURN_PHASES.PLAYER_2_TURN;
      const shouldIncrementRound = nextKey === 'player1';

      return {
        ...state,
        phase: nextPhase,
        round: shouldIncrementRound ? state.round + 1 : state.round,
        lastAction: null,
        feedbackPlayer: null,
        pendingGameOver: null,
        nextPlayerToAct: null,
      };
    }
    case 'RESET_GAME':
      return createInitialState();
    default:
      return state;
  }
};

const GoldRush = () => {
  const [state, dispatch] = useReducer(goldRushReducer, undefined, createInitialState);
  const [demandValue, setDemandValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [cheatOpen, setCheatOpen] = useState(false);

  const perspectiveKey = useMemo(() => {
    if (state.phase === TURN_PHASES.PLAYER_1_TURN) return 'player1';
    if (state.phase === TURN_PHASES.PLAYER_2_TURN) return 'player2';
    if (state.feedbackPlayer) {
      return state.feedbackPlayer === 1 ? 'player1' : 'player2';
    }
    return 'player1';
  }, [state.phase, state.feedbackPlayer]);

  const zoneData = getZoneData(state.round);
  const currentPlayer = state[perspectiveKey];
  const opponentKey = perspectiveKey === 'player1' ? 'player2' : 'player1';
  const opponentPlayer = state[opponentKey];

  const isPlayerTurn =
    (state.phase === TURN_PHASES.PLAYER_1_TURN && perspectiveKey === 'player1') ||
    (state.phase === TURN_PHASES.PLAYER_2_TURN && perspectiveKey === 'player2');

  useEffect(() => {
    if (state.phase === TURN_PHASES.TURN_FEEDBACK || state.phase === TURN_PHASES.TRANSITION_SCREEN) {
      setDemandValue('');
      setInputError('');
    }
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== TURN_PHASES.TURN_FEEDBACK) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'COMPLETE_FEEDBACK' }), 2500);
    return () => clearTimeout(timer);
  }, [state.phase]);

  const handleDemand = () => {
    if (!isPlayerTurn) return;
    const numericDemand = Number(demandValue);
    const validationError = validateDemand(numericDemand, zoneData.minDemand);
    if (validationError) {
      setInputError(validationError);
      return;
    }
    setInputError('');
    dispatch({ type: 'RESOLVE_DEMAND', payload: { activeKey: perspectiveKey, demand: numericDemand } });
  };

  const handleFeedbackAdvance = () => {
    if (state.phase === TURN_PHASES.TURN_FEEDBACK) {
      dispatch({ type: 'COMPLETE_FEEDBACK' });
    }
  };

  const handleCurtainReady = () => {
    if (state.phase === TURN_PHASES.TRANSITION_SCREEN) {
      dispatch({ type: 'READY_NEXT_PLAYER' });
    }
  };

  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const nextPlayerLabel =
    state.nextPlayerToAct === 1 ? 'Player 1' : state.nextPlayerToAct === 2 ? 'Player 2' : 'Next Player';

  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8 lg:px-10">
      <HUD zoneName={zoneData.name} minDemand={zoneData.minDemand} round={state.round} />

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setCheatOpen(true)}
          className="flex items-center gap-2 rounded-full border border-amber-600/60 bg-saloon-800/80 px-4 py-2 text-sm uppercase tracking-[0.3em] text-amber-200 transition hover:border-gold-400 hover:text-gold-200"
        >
          <Lightbulb className="h-4 w-4" />
          Cheat Sheet
        </button>
      </div>

      <div className="space-y-6">
        <OpponentDisplay player={opponentPlayer} label={PLAYER_LABELS[opponentKey]} />
        <PlayerDisplay
          player={currentPlayer}
          label={PLAYER_LABELS[perspectiveKey]}
          demandValue={demandValue}
          setDemandValue={setDemandValue}
          onDemand={handleDemand}
          minDemand={zoneData.minDemand}
          error={inputError}
          disabled={!isPlayerTurn || state.phase !== TURN_PHASES.PLAYER_1_TURN && state.phase !== TURN_PHASES.PLAYER_2_TURN}
        />
      </div>

      <TurnFeedbackOverlay
        visible={state.phase === TURN_PHASES.TURN_FEEDBACK}
        action={state.lastAction}
        onAdvance={handleFeedbackAdvance}
      />

      <TransitionCurtain
        visible={state.phase === TURN_PHASES.TRANSITION_SCREEN}
        nextPlayerLabel={nextPlayerLabel}
        onReady={handleCurtainReady}
      />

      <CheatSheetModal open={cheatOpen} onClose={() => setCheatOpen(false)} />

      <GameOverScreen
        visible={state.phase === TURN_PHASES.GAME_OVER}
        winnerLabel={state.gameOver?.winnerLabel}
        reason={state.gameOver?.reason}
        onRestart={handleRestart}
      />
    </main>
  );
};

export default GoldRush;
