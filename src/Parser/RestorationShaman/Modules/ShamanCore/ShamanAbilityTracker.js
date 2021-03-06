import SPELLS from 'common/SPELLS';

import AbilityTracker from 'Parser/Core/Modules/AbilityTracker';

const TIDAL_WAVES_SPELL_ID = 53390;
const TIDAL_WAVES_BUFF_EXPIRATION_BUFFER = 50; // the buff expiration can occur several MS before the heal event is logged, this is the buffer time that an IoL charge may have dropped during which it will still be considered active.
const TIDAL_WAVES_BUFF_MINIMAL_ACTIVE_TIME = 100; // Minimal duration for which you must have tidal waves. Prevents it from counting a HS/HW as buffed when you cast a riptide at the end.

class ShamanAbilityTracker extends AbilityTracker {
  on_byPlayer_cast(event) {
    if (super.on_byPlayer_cast) {
      super.on_byPlayer_cast(event);
    }

    const spellId = event.ability.guid;
    if (spellId !== SPELLS.HEALING_RAIN_CAST.id) {
      return;
    }

    if (!this.owner.selectedCombatant.hasBuff(SPELLS.RESTORATION_SHAMAN_T20_4SET_BONUS_BUFF.id, event.timestamp)) {
      return;
    }

    const cast = this.getAbility(spellId, event.ability);
    cast.withT20Buff = (cast.withT20Buff || 0) + 1;
  }

  on_byPlayer_heal(event) {
    if (super.on_byPlayer_heal) {
      super.on_byPlayer_heal(event);
    }
    const spellId = event.ability.guid;
    const cast = this.getAbility(spellId, event.ability);

    if (spellId === SPELLS.HEALING_WAVE.id || spellId === SPELLS.HEALING_SURGE_RESTORATION.id) {
      const hasTw = this.owner.selectedCombatant.hasBuff(TIDAL_WAVES_SPELL_ID, event.timestamp, TIDAL_WAVES_BUFF_EXPIRATION_BUFFER,TIDAL_WAVES_BUFF_MINIMAL_ACTIVE_TIME);

      if (hasTw) {
        cast.healingTwHits = (cast.healingTwHits || 0) + 1;
        cast.healingTwHealing = (cast.healingTwHealing || 0) + (event.amount || 0);
        cast.healingTwAbsorbed = (cast.healingTwAbsorbed || 0) + (event.absorbed || 0);
        cast.healingTwOverheal = (cast.healingTwOverheal || 0) + (event.overheal || 0);
      }
    }

  }
}

export default ShamanAbilityTracker;
