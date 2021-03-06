import SPELLS from 'common/SPELLS';

import CoreCastEfficiency from 'Parser/Core/Modules/CastEfficiency';

const SPELL_CATEGORY = {
    ROTATIONAL: 'Rotational Spell',
    COOLDOWNS: 'Cooldown',
    UTILITY: 'Utility',
};
class CastEfficiency extends CoreCastEfficiency {
  static CPM_ABILITIES = [
    //Rotational spells
    {
      spell: SPELLS.HAUNT,
      category: SPELL_CATEGORY.ROTATIONAL,
      getCooldown: haste => 25,
      isActive: combatant => combatant.hasTalent(SPELLS.HAUNT_TALENT.id),
      recommendedCastEfficiency: 0.95,
      extraSuggestion: 'This estimate may not be correct sometimes because of Haunt\'s resets. The real amount of possible Haunts will be higher if there were adds on this fight.',
    },
    {
      spell: SPELLS.PHANTOM_SINGULARITY,
      category: SPELL_CATEGORY.ROTATIONAL,
      getCooldown: haste => 40,
      isActive: combatant => combatant.hasTalent(SPELLS.PHANTOM_SINGULARITY_TALENT.id),
      recommendedCastEfficiency: 0.95,
    },
    {
      spell: SPELLS.AGONY,
      category: SPELL_CATEGORY.ROTATIONAL,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.CORRUPTION_CAST,
      category: SPELL_CATEGORY.ROTATIONAL,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.SIPHON_LIFE,
      category: SPELL_CATEGORY.ROTATIONAL,
      getCooldown: haste => null,
      isActive: combatant => combatant.hasTalent(SPELLS.SIPHON_LIFE_TALENT.id),
      noSuggestion: true,
    },
    {
      spell: SPELLS.UNSTABLE_AFFLICTION_CAST,
      category: SPELL_CATEGORY.ROTATIONAL,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.DRAIN_SOUL,
      category: SPELL_CATEGORY.ROTATIONAL,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.LIFE_TAP,
      category: SPELL_CATEGORY.ROTATIONAL,
      getCooldown: haste => null,
      extraSuggestion: 'If you\'re using Empowered Life Tap, you should keep a very high uptime on the Empowered Life Tap buff.',
      noSuggestion: true,
    },
    {
      spell: SPELLS.SEED_OF_CORRUPTION_DEBUFF,
      category: SPELL_CATEGORY.ROTATIONAL,
      getCooldown: haste => null,
      noSuggestion: true,
    },

    //Cooldowns
    {
      spell: SPELLS.REAP_SOULS,
      category: SPELL_CATEGORY.COOLDOWNS,
      getCooldown: haste => 5,
      noSuggestion: true,
    },
    {
      spell: SPELLS.SOUL_HARVEST,
      category: SPELL_CATEGORY.COOLDOWNS,
      getCooldown: haste => 120,
      isActive: combatant => combatant.hasTalent(SPELLS.SOUL_HARVEST_TALENT.id),
    },
    {
      spell: SPELLS.SUMMON_DOOMGUARD_UNTALENTED,
      category: SPELL_CATEGORY.COOLDOWNS,
      getCooldown: haste => 180,
      isActive: combatant => !combatant.hasTalent(SPELLS.GRIMOIRE_OF_SUPREMACY_TALENT.id),
      recommendedCastEfficiency: 0.95,
    },
    {
      spell: SPELLS.SUMMON_INFERNAL_UNTALENTED,
      category: SPELL_CATEGORY.COOLDOWNS,
      getCooldown: haste => 180,
      isActive: combatant => !combatant.hasTalent(SPELLS.GRIMOIRE_OF_SUPREMACY_TALENT.id),
      recommendedCastEfficiency: 0.95,
    },
    {
      spell: SPELLS.GRIMOIRE_IMP,
      category: SPELL_CATEGORY.COOLDOWNS,
      getCooldown: haste => 90,
      isActive: combatant => combatant.hasTalent(SPELLS.GRIMOIRE_OF_SERVICE_TALENT.id),
    },
    {
      spell: SPELLS.GRIMOIRE_VOIDWALKER,
      category: SPELL_CATEGORY.COOLDOWNS,
      getCooldown: haste => 90,
      isActive: combatant => combatant.hasTalent(SPELLS.GRIMOIRE_OF_SERVICE_TALENT.id),
    },
    {
      spell: SPELLS.GRIMOIRE_FELHUNTER,
      category: SPELL_CATEGORY.COOLDOWNS,
      getCooldown: haste => 90,
      isActive: combatant => combatant.hasTalent(SPELLS.GRIMOIRE_OF_SERVICE_TALENT.id),
    },
    {
      spell: SPELLS.GRIMOIRE_SUCCUBUS,
      category: SPELL_CATEGORY.COOLDOWNS,
      getCooldown: haste => 90,
      isActive: combatant => combatant.hasTalent(SPELLS.GRIMOIRE_OF_SERVICE_TALENT.id),
    },

    //Utility
    {
      spell: SPELLS.BURNING_RUSH,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      isActive: combatant => combatant.hasTalent(SPELLS.BURNING_RUSH_TALENT.id),
      noSuggestion: true,
    },
    {
      spell: SPELLS.UNENDING_RESOLVE,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => 180,
      noSuggestion: true,
    },
    {
      spell: SPELLS.DEMONIC_CIRCLE_SUMMON,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      isActive: combatant => combatant.hasTalent(SPELLS.DEMONIC_CIRCLE_TALENT.id),
      noSuggestion: true,
    },
    {
      spell: SPELLS.DEMONIC_CIRCLE_TELEPORT,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => 30,
      isActive: combatant => combatant.hasTalent(SPELLS.DEMONIC_CIRCLE_TALENT.id),
      noSuggestion: true,
    },
    {
      spell: SPELLS.SOULSTONE,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => 600,
      //TODO: shares cooldown with other combat rezzes, don't know how to calculate properly
      noSuggestion: true,
    },
    {
      spell: SPELLS.SUMMON_DOOMGUARD_TALENTED,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      isActive: combatant => combatant.hasTalent(SPELLS.GRIMOIRE_OF_SUPREMACY_TALENT.id),
      noSuggestion: true,
    },
    {
      spell: SPELLS.SUMMON_INFERNAL_TALENTED,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      isActive: combatant => combatant.hasTalent(SPELLS.GRIMOIRE_OF_SUPREMACY_TALENT.id),
      noSuggestion: true,
    },
    {
      spell: SPELLS.DEMONIC_GATEWAY_CAST,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => 10,
      noSuggestion: true,
    },
    {
      spell: SPELLS.DARK_PACT,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => 60,
      isActive: combatant => combatant.hasTalent(SPELLS.DARK_PACT_TALENT.id),
      noSuggestion: true,
    },
    {
      spell: SPELLS.MORTAL_COIL,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => 45,
      isActive: combatant => combatant.hasTalent(SPELLS.MORTAL_COIL_TALENT.id),
      noSuggestion: true,
    },
    {
      spell: SPELLS.GRIMOIRE_OF_SACRIFICE_TALENT,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => 30,
      isActive: combatant => combatant.hasTalent(SPELLS.GRIMOIRE_OF_SACRIFICE_TALENT.id),
      noSuggestion: true,
    },
    {
      spell: SPELLS.BANISH,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.CREATE_HEALTHSTONE,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.CREATE_SOULWELL,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => 120,
      noSuggestion: true,
    },
    {
      spell: SPELLS.ENSLAVE_DEMON,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.EYE_OF_KILROGG,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.FEAR_CAST,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.HEALTH_FUNNEL_CAST,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.SUMMON_IMP,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.SUMMON_VOIDWALKER,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.SUMMON_FELHUNTER,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.SUMMON_SUCCUBUS,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },
    {
      spell: SPELLS.UNENDING_BREATH,
      category: SPELL_CATEGORY.UTILITY,
      getCooldown: haste => null,
      noSuggestion: true,
    },

  ];

  static SPELL_CATEGORIES = SPELL_CATEGORY;
}

export default CastEfficiency;
