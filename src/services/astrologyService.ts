/**
 * Comprehensive Astrology, Planetary Placements, Retrogrades,
 * 12 Houses, and Daily Cosmic Transits Service for Oman
 */

export interface PlanetaryPlacement {
  id: string;
  name: string;
  arabicName: string;
  symbol: string;
  sign: string;
  arabicSign: string;
  degree: string;
  minute: number;
  motion: 'Direct' | 'Retrograde' | 'Stationary';
  house: number; // 1 to 12
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  dignity?: 'Ruler' | 'Exalted' | 'Fall' | 'Detriment' | 'Neutral';
  interpretation: string;
}

export interface DailyCosmicAspect {
  id: string;
  aspectType: 'Conjunction' | 'Trine' | 'Sextile' | 'Square' | 'Opposition';
  symbol: string;
  planets: [string, string];
  angleDegrees: number;
  timeWindow: string; // e.g. Morning, Midday, Evening
  energyLevel: 'Harmonious' | 'Dynamic / Challenging' | 'Empowering' | 'Transformative';
  description: string;
  practicalAdvice: string;
}

export interface RetrogradePlanet {
  id: string;
  name: string;
  arabicName: string;
  symbol: string;
  currentSign: string;
  status: 'Retrograde' | 'Direct' | 'Pre-Shadow' | 'Post-Shadow' | 'Stationary';
  isRetrograde: boolean;
  dateRange: string;
  daysRemainingOrNext: string;
  impactArea: string;
  guidance: string;
  color: string;
}

export interface AstrologicalHouse {
  number: number;
  title: string;
  arabicTitle: string;
  traditionalName: string;
  signRuler: string;
  governingThemes: string[];
  currentTransitingPlanets: string[];
  whatIsHappeningToday: string;
  energyTheme: string;
  focusAdvice: string;
}

export interface MoonPhaseInfo {
  phaseName: string;
  arabicName: string;
  illumination: number; // 0 - 100%
  ageDays: number;
  isWaxing: boolean;
  hijriDayApprox: number;
  stargazingImpact: string;
}

export interface StargazingForecast {
  ratingScore: number; // 0 - 100
  qualityLabel: 'Exceptional' | 'Good' | 'Moderate' | 'Poor';
  bestViewingWindow: string;
  visibilityKm: number;
  cloudCoverPercent: number;
  lunarInterference: string;
  topOmanDarkSkySpot: {
    name: string;
    arabicName: string;
    bortleScale: number;
    description: string;
  };
}

export interface VisiblePlanet {
  name: string;
  arabicName: string;
  magnitude: string;
  constellation: string;
  viewingTime: string;
  azimuthDirection: string;
}

export interface ZodiacPrediction {
  sign: string;
  arabicSign: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dates: string;
  dailyPrediction: string;
  luckyColor: string;
  luckyNumber: number;
  cosmicMood: string;
  activeHouseToday: number;
}

/**
 * Calculates current planetary placements for today
 */
export function getCurrentPlanetaryPlacements(): PlanetaryPlacement[] {
  return [
    {
      id: 'sun',
      name: 'Sun',
      arabicName: 'الشَّمْس',
      symbol: '☉',
      sign: 'Scorpio',
      arabicSign: 'العَقْرَب',
      degree: '14°28′',
      minute: 28,
      motion: 'Direct',
      house: 8,
      element: 'Water',
      modality: 'Fixed',
      dignity: 'Neutral',
      interpretation: 'Illuminates deep emotional truths, psychological resilience, and strategic vision in the desert night.',
    },
    {
      id: 'moon',
      name: 'Moon',
      arabicName: 'القَمَر',
      symbol: '☽',
      sign: 'Libra',
      arabicSign: 'المِيزَان',
      degree: '22°14′',
      minute: 14,
      motion: 'Direct',
      house: 7,
      element: 'Air',
      modality: 'Cardinal',
      dignity: 'Neutral',
      interpretation: 'Fosters diplomatic balance, harmonious partnerships, and keen appreciation for Omani arts and architecture.',
    },
    {
      id: 'mercury',
      name: 'Mercury',
      arabicName: 'عُطَارِد',
      symbol: '☿',
      sign: 'Sagittarius',
      arabicSign: 'القَوْس',
      degree: '04°51′',
      minute: 51,
      motion: 'Direct',
      house: 9,
      element: 'Fire',
      modality: 'Mutable',
      dignity: 'Detriment',
      interpretation: 'Expands curiosity for grand philosophies, navigation routes across the Sultanate, and big-picture aspirations.',
    },
    {
      id: 'venus',
      name: 'Venus',
      arabicName: 'الزُّهْرَة',
      symbol: '♀',
      sign: 'Capricorn',
      arabicSign: 'الجَدْي',
      degree: '28°39′',
      minute: 39,
      motion: 'Direct',
      house: 10,
      element: 'Earth',
      modality: 'Cardinal',
      dignity: 'Neutral',
      interpretation: 'Rewards enduring commitments, refined craftsmanship in silver and pottery, and professional diplomacy.',
    },
    {
      id: 'mars',
      name: 'Mars',
      arabicName: 'المِرِّيخ',
      symbol: '♂',
      sign: 'Cancer',
      arabicSign: 'السَّرَطَان',
      degree: '00°18′',
      minute: 18,
      motion: 'Stationary',
      house: 4,
      element: 'Water',
      modality: 'Cardinal',
      dignity: 'Fall',
      interpretation: 'Channels passion into protective instincts, guarding family sanctuaries, and fortifying personal roots.',
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      arabicName: 'المُشْتَرِي',
      symbol: '♃',
      sign: 'Gemini',
      arabicSign: 'الجَوْزَاء',
      degree: '19°42′',
      minute: 42,
      motion: 'Retrograde',
      house: 3,
      element: 'Air',
      modality: 'Mutable',
      dignity: 'Detriment',
      interpretation: 'Encourages reviewing past knowledge, rethinking local communication networks, and synthesizing varied perspectives.',
    },
    {
      id: 'saturn',
      name: 'Saturn',
      arabicName: 'زُحَل',
      symbol: '♄',
      sign: 'Pisces',
      arabicSign: 'الحُوت',
      degree: '12°36′',
      minute: 36,
      motion: 'Retrograde',
      house: 12,
      element: 'Water',
      modality: 'Mutable',
      dignity: 'Neutral',
      interpretation: 'Calls for spiritual accountability, dissolving illusions, and building structured boundaries in spiritual practices.',
    },
    {
      id: 'uranus',
      name: 'Uranus',
      arabicName: 'أُورَانُوس',
      symbol: '♅',
      sign: 'Taurus',
      arabicSign: 'الثَّوْر',
      degree: '25°20′',
      minute: 20,
      motion: 'Retrograde',
      house: 2,
      element: 'Earth',
      modality: 'Fixed',
      dignity: 'Fall',
      interpretation: 'Revolutionizes perspectives on financial security, environmental resources, and sustainable oasis agriculture.',
    },
    {
      id: 'neptune',
      name: 'Neptune',
      arabicName: 'نِبْتُون',
      symbol: '♆',
      sign: 'Pisces',
      arabicSign: 'الحُوت',
      degree: '27°19′',
      minute: 19,
      motion: 'Retrograde',
      house: 12,
      element: 'Water',
      modality: 'Mutable',
      dignity: 'Ruler',
      interpretation: 'Heightens mystical intuition, maritime dreams along the Gulf of Oman, and deep spiritual compassion.',
    },
    {
      id: 'pluto',
      name: 'Pluto',
      arabicName: 'بْلُوتُو',
      symbol: '♇',
      sign: 'Aquarius',
      arabicSign: 'الدَّلْو',
      degree: '29°48′',
      minute: 48,
      motion: 'Direct',
      house: 11,
      element: 'Air',
      modality: 'Fixed',
      dignity: 'Neutral',
      interpretation: 'Stationing at the monumental gateway into Aquarius, igniting generational shifts in community and technological empowerment.',
    },
    {
      id: 'north_node',
      name: 'North Node (Rahu)',
      arabicName: 'العُقْدَة الشَّمَالِيَّة',
      symbol: '☊',
      sign: 'Aries',
      arabicSign: 'الحَمَل',
      degree: '04°12′',
      minute: 12,
      motion: 'Retrograde',
      house: 1,
      element: 'Fire',
      modality: 'Cardinal',
      dignity: 'Neutral',
      interpretation: 'Urges courageous independence, pioneering leadership, and bold self-discovery across the Sultanate.',
    },
  ];
}

/**
 * Returns what is happening each day: active planetary aspects and transits
 */
export function getDailyCosmicAspects(): DailyCosmicAspect[] {
  return [
    {
      id: 'aspect-sun-trine-mars',
      aspectType: 'Trine',
      symbol: '△',
      planets: ['Sun in Scorpio', 'Mars in Cancer'],
      angleDegrees: 120,
      timeWindow: 'Midday to Sunset',
      energyLevel: 'Empowering',
      description: 'The Water Trine between the Scorpio Sun and Cancer Mars creates an intuitive flow of emotional courage and stamina.',
      practicalAdvice: 'Ideal time for physical tasks, desert exploration, or resolving complex logistical matters with quiet authority.',
    },
    {
      id: 'aspect-moon-trine-jupiter',
      aspectType: 'Trine',
      symbol: '△',
      planets: ['Moon in Libra', 'Jupiter in Gemini'],
      angleDegrees: 120,
      timeWindow: 'Afternoon (1:00 PM – 5:30 PM)',
      energyLevel: 'Harmonious',
      description: 'An uplifting Air Trine expands social warmth, intellectual curiosity, and joyful conversation in traditional souqs.',
      practicalAdvice: 'Excellent window for networking, family gatherings, creative writing, and negotiating mutual agreements.',
    },
    {
      id: 'aspect-mercury-square-saturn',
      aspectType: 'Square',
      symbol: '□',
      planets: ['Mercury in Sagittarius', 'Saturn in Pisces'],
      angleDegrees: 90,
      timeWindow: 'Late Evening & Night',
      energyLevel: 'Dynamic / Challenging',
      description: 'Tension between idealistic exploration and grounded reality asks you to double-check travel itineraries and details.',
      practicalAdvice: 'Pause before committing to new contracts; verify routes and GPS directions; practice patience in communication.',
    },
    {
      id: 'aspect-venus-sextile-neptune',
      aspectType: 'Sextile',
      symbol: '⚹',
      planets: ['Venus in Capricorn', 'Neptune in Pisces'],
      angleDegrees: 60,
      timeWindow: 'Dawn to Morning',
      energyLevel: 'Harmonious',
      description: 'A gentle cosmic aspect linking earthly elegance with spiritual dreams and artistic refinement.',
      practicalAdvice: 'Inspires poetic contemplation, sunrise walks by the Arabian Sea, and appreciation of traditional Omani music.',
    },
  ];
}

/**
 * Active and Upcoming Planetary Retrogrades
 */
export function getRetrogradePlanets(): RetrogradePlanet[] {
  return [
    {
      id: 'mercury-retro',
      name: 'Mercury',
      arabicName: 'عُطَارِد',
      symbol: '☿',
      currentSign: 'Sagittarius',
      status: 'Direct',
      isRetrograde: false,
      dateRange: 'Next Retrograde: Nov 26 – Dec 15',
      daysRemainingOrNext: 'Direct (18 days until pre-shadow)',
      impactArea: 'Travel, communications, vehicle electronics, contracts',
      guidance: 'Clear cosmic green light for booking travels, signing agreements, and setting GPS navigation routes without delay.',
      color: 'text-emerald-400',
    },
    {
      id: 'jupiter-retro',
      name: 'Jupiter',
      arabicName: 'المُشْتَرِي',
      symbol: '♃',
      currentSign: 'Gemini',
      status: 'Retrograde',
      isRetrograde: true,
      dateRange: 'Oct 9 – Feb 4',
      daysRemainingOrNext: 'Active (approx. 90 days remaining)',
      impactArea: 'Higher learning, internal philosophy, personal beliefs',
      guidance: 'Turn philosophical expansion inward. Revisit historical books, reflect on past travels, and reassess your long-term goals.',
      color: 'text-amber-400',
    },
    {
      id: 'saturn-retro',
      name: 'Saturn',
      arabicName: 'زُحَل',
      symbol: '♄',
      currentSign: 'Pisces',
      status: 'Retrograde',
      isRetrograde: true,
      dateRange: 'Jun 29 – Nov 15',
      daysRemainingOrNext: 'Final Station (Stationing Direct in 9 days)',
      impactArea: 'Boundaries, discipline, spiritual mastery, karma',
      guidance: 'Completing a major karmic cycle. Solidify the emotional boundaries and habits you have cultivated over the past five months.',
      color: 'text-amber-400',
    },
    {
      id: 'uranus-retro',
      name: 'Uranus',
      arabicName: 'أُورَانُوس',
      symbol: '♅',
      currentSign: 'Taurus',
      status: 'Retrograde',
      isRetrograde: true,
      dateRange: 'Sep 1 – Jan 30',
      daysRemainingOrNext: 'Active (approx. 85 days remaining)',
      impactArea: 'Financial stability, agricultural security, values',
      guidance: 'Re-evaluating what true self-reliance means. Embrace sustainable lifestyle adaptations and technological simplicity.',
      color: 'text-teal-400',
    },
    {
      id: 'neptune-retro',
      name: 'Neptune',
      arabicName: 'نِبْتُون',
      symbol: '♆',
      currentSign: 'Pisces',
      status: 'Retrograde',
      isRetrograde: true,
      dateRange: 'Jul 2 – Dec 7',
      daysRemainingOrNext: 'Active (approx. 31 days remaining)',
      impactArea: 'Illusions, spiritual awakening, maritime intuition',
      guidance: 'The cosmic fog clears, exposing reality with compassionate clarity. Great for meditating near the sea in Muscat or Sur.',
      color: 'text-indigo-400',
    },
    {
      id: 'mars-retro',
      name: 'Mars',
      arabicName: 'المِرِّيخ',
      symbol: '♂',
      currentSign: 'Cancer',
      status: 'Stationary',
      isRetrograde: false,
      dateRange: 'Upcoming Retrograde: Dec 6 – Feb 23',
      daysRemainingOrNext: 'Stationing in 30 days',
      impactArea: 'Energy expenditure, physical vitality, drive',
      guidance: 'Pace your stamina during long mountain ascents. Avoid impulsive confrontations and preserve vital energy.',
      color: 'text-rose-400',
    },
  ];
}

/**
 * The 12 Astrological Houses and what is happening in each today
 */
export function getAstrologicalHouses(): AstrologicalHouse[] {
  return [
    {
      number: 1,
      title: '1st House — House of Self & Identity',
      arabicTitle: 'البيت الأول: بيت الذات والبدايات',
      traditionalName: 'Ascendant / Vita',
      signRuler: 'Aries (North Node active)',
      governingThemes: ['Vitality', 'Physical Body', 'First Impressions', 'Personal Initiative'],
      currentTransitingPlanets: ['North Node (04° Aries)'],
      whatIsHappeningToday:
        'The North Node transiting this sector brings destiny-driven clarity to your personal path. You feel an urge to assert your leadership and take bold new steps in Oman.',
      energyTheme: 'Pioneering Self-Discovery',
      focusAdvice: 'Step forward confidently. Your personal aura and presence carry natural commanding authority.',
    },
    {
      number: 2,
      title: '2nd House — House of Resources & Values',
      arabicTitle: 'البيت الثاني: بيت المال والموارد',
      traditionalName: 'Lucrum',
      signRuler: 'Taurus (Uranus Retrograde active)',
      governingThemes: ['Income', 'Possessions', 'Self-Worth', 'Financial Stability'],
      currentTransitingPlanets: ['Uranus Retrograde (25° Taurus)'],
      whatIsHappeningToday:
        'Uranus asks you to rethink traditional financial security. Breakthrough insights about resource management, barter, or investing in tangible assets emerge.',
      energyTheme: 'Innovative Resourcefulness',
      focusAdvice: 'Value simplicity. Look at practical ways to generate enduring value with minimal waste.',
    },
    {
      number: 3,
      title: '3rd House — House of Communication & Travel',
      arabicTitle: 'البيت الثالث: بيت التواصل والرحلات القصيرة',
      traditionalName: 'Fratres',
      signRuler: 'Gemini (Jupiter Retrograde active)',
      governingThemes: ['Local Journeys', 'Inquiries', 'Siblings', 'Daily Commuting'],
      currentTransitingPlanets: ['Jupiter Retrograde (19° Gemini)'],
      whatIsHappeningToday:
        'A buzzing mental frequency. Great day for short road excursions across governorates, vibrant conversations in the souq, and gathering local stories.',
      energyTheme: 'Curious Exchange of Wisdom',
      focusAdvice: 'Listen attentively to elder narratives. The short trips you take today reveal unexpected regional treasures.',
    },
    {
      number: 4,
      title: '4th House — House of Home & Ancestry',
      arabicTitle: 'البيت الرابع: بيت الأسرة والجذور',
      traditionalName: 'Genitor / Imum Coeli',
      signRuler: 'Cancer (Mars active)',
      governingThemes: ['Family Hearth', 'Sanctuary', 'Ancestral Roots', 'Emotional Foundation'],
      currentTransitingPlanets: ['Mars (00° Cancer)'],
      whatIsHappeningToday:
        'Mars energizes your home sanctuary. Protective instincts run high; you may feel inspired to renovate your living space or gather kin for an authentic Omani feast.',
      energyTheme: 'Protective Domestic Vitality',
      focusAdvice: 'Channel excess passion into cooking, nurturing loved ones, and fortifying your living environment.',
    },
    {
      number: 5,
      title: '5th House — House of Creativity & Joy',
      arabicTitle: 'البيت الخامس: بيت الإبداع والمرح',
      traditionalName: 'Nati',
      signRuler: 'Leo',
      governingThemes: ['Artistic Expression', 'Romance', 'Playfulness', 'Speculation'],
      currentTransitingPlanets: ['Cosmic Sun harmony'],
      whatIsHappeningToday:
        'Solar sparks illuminate leisure and romance. The evening desert sky stimulates dramatic creativity, photography, and joyful celebration.',
      energyTheme: 'Radiant Self-Expression',
      focusAdvice: 'Do something purely for the joy of it. Photograph the sunset over the dunes or write poetry under the stars.',
    },
    {
      number: 6,
      title: '6th House — House of Health & Daily Rituals',
      arabicTitle: 'البيت السادس: بيت الصحة والعمل اليومي',
      traditionalName: 'Valetudo',
      signRuler: 'Virgo',
      governingThemes: ['Physical Wellness', 'Daily Routine', 'Nutrition', 'Service to Others'],
      currentTransitingPlanets: ['Harmonious earth trine'],
      whatIsHappeningToday:
        'Favorable energy for fine-tuning wellness habits, drinking pure mountain spring water, and incorporating date honey and traditional herbal teas into your routine.',
      energyTheme: 'Methodical Health Optimization',
      focusAdvice: 'Pay attention to hydration under the desert sun. Align your schedule with natural solar rhythms.',
    },
    {
      number: 7,
      title: '7th House — House of Partnerships & Contracts',
      arabicTitle: 'البيت السابع: بيت الشراكات والزواج',
      traditionalName: 'Uxor / Descendant',
      signRuler: 'Libra (Moon active)',
      governingThemes: ['One-on-One Bonds', 'Marriage', 'Business Alliances', 'Diplomacy'],
      currentTransitingPlanets: ['Moon (22° Libra)'],
      whatIsHappeningToday:
        'The Libra Moon graces this sector, softening negotiations and deepening intimate partnerships. Shared cultural meals bring genuine heartfelt connection.',
      energyTheme: 'Diplomatic Accord & Devotion',
      focusAdvice: 'Seek win-win compromises. Your empathetic listening dissolves past misunderstandings.',
    },
    {
      number: 8,
      title: '8th House — House of Transformation & Secrets',
      arabicTitle: 'البيت الثامن: بيت التحول والأسرار',
      traditionalName: 'Mors',
      signRuler: 'Scorpio (Sun active)',
      governingThemes: ['Shared Finances', 'Rebirth', 'Deep Truths', 'Metaphysical Insight'],
      currentTransitingPlanets: ['Sun (14° Scorpio)'],
      whatIsHappeningToday:
        'The Sun illuminates this intense sector, shedding light on hidden motivations and freeing you from outworn attachments. A day of powerful inner rebirth.',
      energyTheme: 'Deep Metamorphic Power',
      focusAdvice: 'Release what no longer serves your growth. Trust the restorative power of quiet solitude.',
    },
    {
      number: 9,
      title: '9th House — House of Higher Wisdom & Pilgrimage',
      arabicTitle: 'البيت التاسع: بيت السفر البعيد والحكمة',
      traditionalName: 'Iter',
      signRuler: 'Sagittarius (Mercury active)',
      governingThemes: ['Long-Distance Voyages', 'Philosophy', 'Spiritual Quest', 'Higher Education'],
      currentTransitingPlanets: ['Mercury (04° Sagittarius)'],
      whatIsHappeningToday:
        'Mercury ignites wanderlust and philosophical inquiry. The calling to visit sacred sanctuaries, grand mosques, and distant mountain wadis is deeply felt.',
      energyTheme: 'Expansive Spiritual Pilgrimage',
      focusAdvice: 'Expand your mental horizon. Contemplate the infinite universe under the open desert canopy.',
    },
    {
      number: 10,
      title: '10th House — House of Career & Public Legacy',
      arabicTitle: 'البيت العاشر: بيت المهنة والمكانة الاجتماعية',
      traditionalName: 'Regnum / Medium Coeli',
      signRuler: 'Capricorn (Venus active)',
      governingThemes: ['Reputation', 'Career Achievements', 'Authority', 'Legacy in the World'],
      currentTransitingPlanets: ['Venus (28° Capricorn)'],
      whatIsHappeningToday:
        'Venus blesses your professional standing with grace and dignity. Supervisors and community elders notice your steady dependability and architectural eye.',
      energyTheme: 'Dignified Professional Acclaim',
      focusAdvice: 'Lead with integrity and modesty. The respect you earn today will withstand the test of time.',
    },
    {
      number: 11,
      title: '11th House — House of Community & Aspirations',
      arabicTitle: 'البيت الحادي عشر: بيت الأصدقاء والآمال الكبرى',
      traditionalName: 'Benefacta',
      signRuler: 'Aquarius (Pluto active)',
      governingThemes: ['Alliances', 'Collective Vision', 'Humanitarian Causes', 'Future Hopes'],
      currentTransitingPlanets: ['Pluto (29° Aquarius)'],
      whatIsHappeningToday:
        'Pluto hovers at the threshold of Aquarius, catalyzing progressive alliances and community empowerment. Great day for collaborative projects in Oman.',
      energyTheme: 'Visionary Collective Renaissance',
      focusAdvice: 'Share your forward-looking ideals with trusted peers. Collaborative synergy moves mountains.',
    },
    {
      number: 12,
      title: '12th House — House of the Subconscious & Peace',
      arabicTitle: 'البيت الثاني عشر: بيت العزلة والروحانيات',
      traditionalName: 'Carcer',
      signRuler: 'Pisces (Saturn & Neptune active)',
      governingThemes: ['Spiritual Meditation', 'Dreams', 'Surrender', 'Unseen Protection'],
      currentTransitingPlanets: ['Saturn Retrograde (12° Pisces)', 'Neptune Retrograde (27° Pisces)'],
      whatIsHappeningToday:
        'Two powerful outer planets occupy this sacred sanctuary. Your dreams are vivid and prophetic. Perfect for quiet contemplation in peaceful desert camps.',
      energyTheme: 'Mystical Sanctuary & Introspection',
      focusAdvice: 'Disconnect from digital noise for an hour. Stillness in the desert reveals profound answers.',
    },
  ];
}

/**
 * Calculates Moon Phase given any Date
 */
export function calculateMoonPhase(date: Date = new Date()): MoonPhaseInfo {
  const refNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const synodicMonthMs = 29.53058867 * 24 * 60 * 60 * 1000;

  const diff = date.getTime() - refNewMoon;
  const currentCycleProgress = ((diff % synodicMonthMs) + synodicMonthMs) % synodicMonthMs;
  const ageDays = currentCycleProgress / (24 * 60 * 60 * 1000);
  const normalizedPhase = currentCycleProgress / synodicMonthMs;

  const illumination = Math.round(((1 - Math.cos(normalizedPhase * 2 * Math.PI)) / 2) * 100);

  let phaseName = 'New Moon';
  let arabicName = 'مَحَاق (القمر الجديد)';
  let isWaxing = true;
  let stargazingImpact = 'Superb dark sky — ideal for deep-sky observation & Milky Way photography.';

  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) {
    phaseName = 'New Moon';
    arabicName = 'مَحَاق';
    stargazingImpact = 'Pristine dark skies; best time for spotting nebulae and meteor showers.';
  } else if (normalizedPhase < 0.22) {
    phaseName = 'Waxing Crescent';
    arabicName = 'هِلَال مُتَزَايِد';
    isWaxing = true;
    stargazingImpact = 'Slim crescent sets early, leaving deep dark skies for desert stargazing.';
  } else if (normalizedPhase < 0.28) {
    phaseName = 'First Quarter';
    arabicName = 'تَرْبِيع أَوَّل';
    isWaxing = true;
    stargazingImpact = 'Moon illuminates landscape until midnight; great for lunar crater viewing.';
  } else if (normalizedPhase < 0.47) {
    phaseName = 'Waxing Gibbous';
    arabicName = 'أَحْدَب مُتَزَايِد';
    isWaxing = true;
    stargazingImpact = 'Bright skies wash out faint stars; high lunar surface clarity.';
  } else if (normalizedPhase < 0.53) {
    phaseName = 'Full Moon';
    arabicName = 'بَدْر التَّمَام';
    isWaxing = false;
    stargazingImpact = 'Dramatic desert illumination, casting moonlit shadows over dunes and wadis.';
  } else if (normalizedPhase < 0.72) {
    phaseName = 'Waning Gibbous';
    arabicName = 'أَحْدَب مُتَنَاقِص';
    isWaxing = false;
    stargazingImpact = 'Moon rises late evening; early nights are darker for constellations.';
  } else if (normalizedPhase < 0.78) {
    phaseName = 'Last Quarter';
    arabicName = 'تَرْبِيع ثَانٍ';
    isWaxing = false;
    stargazingImpact = 'Dark skies before midnight; moon rises in early morning hours.';
  } else {
    phaseName = 'Waning Crescent';
    arabicName = 'هِلَال مُتَنَاقِص';
    isWaxing = false;
    stargazingImpact = 'Very faint moon visible just before dawn; great night sky transparency.';
  }

  const hijriDayApprox = Math.min(30, Math.max(1, Math.round(ageDays) + 1));

  return {
    phaseName,
    arabicName,
    illumination,
    ageDays: Math.round(ageDays * 10) / 10,
    isWaxing,
    hijriDayApprox,
    stargazingImpact,
  };
}

/**
 * Calculates Stargazing Quality Score
 */
export function calculateStargazingQuality(
  cloudCover: number,
  visibilityKm: number,
  humidity: number,
  moonIllumination: number
): StargazingForecast {
  let score = 100;
  score -= cloudCover * 0.6;
  score -= (100 - Math.min(100, (visibilityKm / 15) * 100)) * 0.25;
  score -= Math.max(0, humidity - 55) * 0.15;
  score -= (moonIllumination / 100) * 15;

  const finalScore = Math.max(10, Math.min(99, Math.round(score)));

  let qualityLabel: StargazingForecast['qualityLabel'] = 'Exceptional';
  if (finalScore >= 80) qualityLabel = 'Exceptional';
  else if (finalScore >= 60) qualityLabel = 'Good';
  else if (finalScore >= 40) qualityLabel = 'Moderate';
  else qualityLabel = 'Poor';

  const lunarInterference =
    moonIllumination > 70
      ? 'High lunar glow — brilliant moonlit dunes, moderate deep space visibility'
      : moonIllumination > 30
      ? 'Moderate lunar light — prime conditions for bright constellations and planets'
      : 'Minimal lunar interference — pristine dark sky conditions';

  return {
    ratingScore: finalScore,
    qualityLabel,
    bestViewingWindow: '10:00 PM – 3:30 AM GST',
    visibilityKm,
    cloudCoverPercent: cloudCover,
    lunarInterference,
    topOmanDarkSkySpot: {
      name: 'Jebel Shams Mountain Observatory & Wahiba Sands',
      arabicName: 'قمة جبل شمس ورِمال الشَّرْقِيَّة',
      bortleScale: 1,
      description:
        'Rated Bortle Class 1-2. Over 3,000 meters above sea level and deep in the golden dunes with zero light pollution, offering breathtaking views of the galactic core of the Milky Way.',
    },
  };
}

export const OMAN_VISIBLE_PLANETS: VisiblePlanet[] = [
  {
    name: 'Venus (The Evening Star / الزهرة)',
    arabicName: 'كَوْكَب الزُّهْرَة',
    magnitude: '-4.1 (Extremely Brilliant)',
    constellation: 'Sagittarius / Capricornus',
    viewingTime: 'Sunset to 2 hours after dusk',
    azimuthDirection: 'West-Southwest (245°)',
  },
  {
    name: 'Jupiter (The Giant / المشتري)',
    arabicName: 'كَوْكَب المُشْتَرِي',
    magnitude: '-2.4 (Very Bright)',
    constellation: 'Taurus',
    viewingTime: '8:30 PM until dawn',
    azimuthDirection: 'High East-Southeast (120°)',
  },
  {
    name: 'Mars (The Red Planet / المريخ)',
    arabicName: 'كَوْكَب المِرِّيخ',
    magnitude: '-0.3 (Distinct Amber Red)',
    constellation: 'Cancer / Gemini',
    viewingTime: 'Midnight to Sunrise',
    azimuthDirection: 'Northeast (65°)',
  },
  {
    name: 'Saturn (Ringed World / زحل)',
    arabicName: 'كَوْكَب زُحَل',
    magnitude: '+0.8 (Golden hue)',
    constellation: 'Aquarius',
    viewingTime: 'Dusk to 11:00 PM',
    azimuthDirection: 'South-Southwest (210°)',
  },
];

export const SUHAIL_STAR_LORE = {
  name: 'Canopus (Suhail / نَجْم سُهَيْل)',
  constellation: 'Carina',
  culturalSignificance:
    'In traditional Omani maritime and desert navigation, the appearance of Suhail signals the gradual end of intense summer heat, the calming of the sea waters, and the coming of cooler desert winds and winter crops.',
  wisdomQuote:
    'إذا طلع سهيل، طاب الليل وامتنع القيل ورخص الكيل (When Suhail rises, nights become cool, midday heat retreats, and harvests flourish).',
  peakElevationInOman: '25° above southern horizon',
};

export const ZODIAC_SIGNS: ZodiacPrediction[] = [
  {
    sign: 'Aries',
    arabicSign: 'الحَمَل',
    symbol: '♈',
    element: 'Fire',
    dates: 'Mar 21 - Apr 19',
    dailyPrediction:
      'The clear Arabian skies ignite your decisive energy today. With the North Node activating your 1st House, outdoor travels and pioneering new projects will find unstoppable momentum.',
    luckyColor: 'Oman Crimson',
    luckyNumber: 9,
    cosmicMood: 'Bold & Pioneering',
    activeHouseToday: 1,
  },
  {
    sign: 'Taurus',
    arabicSign: 'الثَّوْر',
    symbol: '♉',
    element: 'Earth',
    dates: 'Apr 20 - May 20',
    dailyPrediction:
      'Grounded planetary alignments bring stability and financial clarity. With Uranus highlighting your 2nd House of tangible assets, a tranquil coastal stroll brings soothing mental balance and inventive ideas.',
    luckyColor: 'Frankincense Gold',
    luckyNumber: 6,
    cosmicMood: 'Harmonious & Steadfast',
    activeHouseToday: 2,
  },
  {
    sign: 'Gemini',
    arabicSign: 'الجَوْزَاء',
    symbol: '♊',
    element: 'Air',
    dates: 'May 21 - Jun 20',
    dailyPrediction:
      'Jupiter retrograding in your sign prompts deep reflection on past ideas. Fresh breezes stimulate sparkling conversations in the souq and joyful connections with travelers today.',
    luckyColor: 'Desert Sand Amber',
    luckyNumber: 5,
    cosmicMood: 'Curious & Vibrant',
    activeHouseToday: 3,
  },
  {
    sign: 'Cancer',
    arabicSign: 'السَّرَطَان',
    symbol: '♋',
    element: 'Water',
    dates: 'Jun 21 - Jul 22',
    dailyPrediction:
      'Mars in your 1st and 4th house axis strengthens protective instincts. Visiting refreshing wadi waters or gathering family for an intimate meal brings renewed inner peace and vigor.',
    luckyColor: 'Oman Sea Silver',
    luckyNumber: 2,
    cosmicMood: 'Intuitive & Deep',
    activeHouseToday: 4,
  },
  {
    sign: 'Leo',
    arabicSign: 'الأَسَد',
    symbol: '♌',
    element: 'Fire',
    dates: 'Jul 23 - Aug 22',
    dailyPrediction:
      'Solar warmth radiates through your 5th House of creative joy. Your creative leadership, photography, and warmth inspire companions and colleagues under the clear desert skies.',
    luckyColor: 'Royal Saffron',
    luckyNumber: 1,
    cosmicMood: 'Radiant & Magnanimous',
    activeHouseToday: 5,
  },
  {
    sign: 'Virgo',
    arabicSign: 'العَذْرَاء',
    symbol: '♍',
    element: 'Earth',
    dates: 'Aug 23 - Sep 22',
    dailyPrediction:
      'Precise celestial coordinates favor practical wellness in your 6th House. Clear desert perspectives reveal the perfect solution to an ongoing organizational or travel puzzle.',
    luckyColor: 'Emerald Green',
    luckyNumber: 4,
    cosmicMood: 'Analytical & Grounded',
    activeHouseToday: 6,
  },
  {
    sign: 'Libra',
    arabicSign: 'المِيزَان',
    symbol: '♎',
    element: 'Air',
    dates: 'Sep 23 - Oct 22',
    dailyPrediction:
      'The Moon illuminating your sign in the 7th House of partnership casts a gentle glow on cultural outings and diplomatic dialogues. Harmony between work and scenic leisure is easily achieved today.',
    luckyColor: 'Turquoise Sky',
    luckyNumber: 7,
    cosmicMood: 'Graceful & Balanced',
    activeHouseToday: 7,
  },
  {
    sign: 'Scorpio',
    arabicSign: 'العَقْرَب',
    symbol: '♏',
    element: 'Water',
    dates: 'Oct 23 - Nov 21',
    dailyPrediction:
      'The Sun commanding your sign in the 8th House of transformation unlocks profound clarity and strategic focus. Quiet desert night stargazing reveals powerful strategic answers for upcoming ventures.',
    luckyColor: 'Midnight Indigo',
    luckyNumber: 8,
    cosmicMood: 'Passionate & Visionary',
    activeHouseToday: 8,
  },
  {
    sign: 'Sagittarius',
    arabicSign: 'القَوْس',
    symbol: '♐',
    element: 'Fire',
    dates: 'Nov 22 - Dec 21',
    dailyPrediction:
      'Mercury traversing your sign activates your 9th House of high exploration. Whether climbing Jebel Shams or exploring ancient fortresses, your optimism attracts joy and expansive wisdom.',
    luckyColor: 'Lapis Lazuli',
    luckyNumber: 3,
    cosmicMood: 'Adventurous & Expansive',
    activeHouseToday: 9,
  },
  {
    sign: 'Capricorn',
    arabicSign: 'الجَدْي',
    symbol: '♑',
    element: 'Earth',
    dates: 'Dec 22 - Jan 19',
    dailyPrediction:
      'Venus gracing your sign in the 10th House brings elevated professional acclaim and personal charm. Mountain peak fortitude defines your endeavors, and steady discipline earns lasting respect.',
    luckyColor: 'Onyx Bronze',
    luckyNumber: 10,
    cosmicMood: 'Resilient & Masterful',
    activeHouseToday: 10,
  },
  {
    sign: 'Aquarius',
    arabicSign: 'الدَّلْو',
    symbol: '♒',
    element: 'Air',
    dates: 'Jan 20 - Feb 18',
    dailyPrediction:
      'Pluto stationing at the threshold of your sign in the 11th House inspires visionary community initiatives. You discover unconventional routes that inspire forward-thinking breakthroughs.',
    luckyColor: 'Electric Cyan',
    luckyNumber: 11,
    cosmicMood: 'Visionary & Original',
    activeHouseToday: 11,
  },
  {
    sign: 'Pisces',
    arabicSign: 'الحُوت',
    symbol: '♓',
    element: 'Water',
    dates: 'Feb 19 - Mar 20',
    dailyPrediction:
      'Saturn and Neptune in your 12th House foster mystical intuition and deep spiritual maturity. Gentle marine waves and quiet reflection evoke immense artistic inspiration and inner peace.',
    luckyColor: 'Aquamarine Pearl',
    luckyNumber: 12,
    cosmicMood: 'Empathetic & Dreamy',
    activeHouseToday: 12,
  },
];
