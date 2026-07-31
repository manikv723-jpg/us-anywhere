// The 12 places. Captions are static on purpose — the original app burned an
// extra Gemini text call per card, which is what blew up the free-tier quota.
export interface Place {
  location: string;
  city: string;
  caption: string;
}

export const PLACES: Place[] = [
  { location: 'the Eiffel Tower in Paris at golden hour', city: 'Paris', caption: 'Where we said we would go first.' },
  { location: 'the white cliffs of Santorini, Greece at sunset', city: 'Santorini', caption: 'Blue doors, and nowhere to be.' },
  { location: 'a cherry blossom street in Kyoto, Japan', city: 'Kyoto', caption: 'Petals falling like it was staged.' },
  { location: 'the canals of Venice, Italy', city: 'Venice', caption: 'Lost on purpose, every single turn.' },
  { location: 'the Amalfi Coast cliffside in Italy', city: 'Amalfi', caption: 'Lemons, salt air, no plans.' },
  { location: 'a snowy peak in the Swiss Alps', city: 'The Alps', caption: 'Cold enough to keep holding on.' },
  { location: 'an overwater villa in the Maldives', city: 'Maldives', caption: 'Just water, and the two of us.' },
  { location: 'the old town square of Prague at night', city: 'Prague', caption: 'Every street looked like a film set.' },
  { location: 'a beach in Goa, India at sunset', city: 'Goa', caption: 'Where it all actually started.' },
  { location: 'snowfall in Manali, Himachal Pradesh, India', city: 'Manali', caption: 'One blanket, two cups of chai.' },
  { location: 'the lake palace of Udaipur, Rajasthan, India', city: 'Udaipur', caption: 'You looked like royalty. You are.' },
  { location: 'a neon-lit street in Seoul, South Korea in the rain', city: 'Seoul', caption: 'Sharing one umbrella, badly.' },
];

// 12 photos would leave a sphere this size looking bare, so each image takes
// two positions on the globe. Same visual density as the 48-card original at
// a quarter of the generation cost.
export const TOTAL_POSITIONS = 40;
export const GLOBE_RADIUS = 4.2;
export const CARD_WIDTH = 1.95;
export const CARD_HEIGHT = 2.6;
