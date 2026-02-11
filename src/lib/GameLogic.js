const LOOT_DECK = [80, 80, 100, 100, 120, 120, 150, 150, 180, 200, 220, 250];

const MIN_DEMAND = {
  surface: 10,
  deepMine: 50,
  core: 100,
};

const ZONE_THRESHOLDS = [
  { maxRound: 3, name: 'Surface', key: 'surface' },
  { maxRound: 6, name: 'Deep Mine', key: 'deepMine' },
  { maxRound: Infinity, name: 'Core', key: 'core' },
];

export const shuffleDeck = (deck) => {
  const cards = [...deck];
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

export const drawCards = (deck, count) => {
  const cards = [...deck];
  const drawnCards = cards.splice(0, count);
  return { drawnCards, remainingDeck: cards };
};

export const initializeGame = () => {
  const shuffled = shuffleDeck(LOOT_DECK);
  const { drawnCards: p1Cards, remainingDeck: deckAfterP1 } = drawCards(shuffled, 2);
  const { drawnCards: p2Cards } = drawCards(deckAfterP1, 2);

  return {
    player1Gold: p1Cards.reduce((sum, value) => sum + value, 0),
    player2Gold: p2Cards.reduce((sum, value) => sum + value, 0),
  };
};

export const getZoneData = (round) => {
  const zone =
    ZONE_THRESHOLDS.find((entry) => round <= entry.maxRound) ||
    ZONE_THRESHOLDS[ZONE_THRESHOLDS.length - 1];
  return {
    name: zone.name,
    minDemand: MIN_DEMAND[zone.key],
  };
};

export const validateDemand = (amount, minDemand) => {
  if (!amount || Number.isNaN(Number(amount))) {
    return 'Enter a number.';
  }
  if (amount % 10 !== 0) {
    return 'Demand must be a multiple of 10.';
  }
  if (amount < minDemand) {
    return `Minimum demand is ${minDemand} gold.`;
  }
  if (amount <= 0) {
    return 'Demand must be positive.';
  }
  return null;
};

export const resolveDemand = (demandAmount, activePlayerGold, opponentGold) => {
  if (opponentGold >= demandAmount) {
    return {
      success: true,
      transfer: demandAmount,
      newActiveGold: activePlayerGold + demandAmount,
      newOpponentGold: opponentGold - demandAmount,
    };
  }

  return {
    success: false,
    transfer: 0,
    newActiveGold: activePlayerGold,
    newOpponentGold: opponentGold,
  };
};

export const initialPlayerState = (initialGold) => ({
  gold: initialGold,
  pickaxes: 3,
});

export const TURN_PHASES = {
  PLAYER_1_TURN: 'PLAYER_1_TURN',
  PLAYER_2_TURN: 'PLAYER_2_TURN',
  TURN_FEEDBACK: 'TURN_FEEDBACK',
  TRANSITION_SCREEN: 'TRANSITION_SCREEN',
  GAME_OVER: 'GAME_OVER',
};
