import React from 'react';

import CoreAlwaysBeCasting from 'Parser/Core/Modules/AlwaysBeCasting';

import SPELLS from 'common/SPELLS';
import Icon from 'common/Icon';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import SpellLink from "../../../../common/SpellLink";

class AlwaysBeCasting extends CoreAlwaysBeCasting {
  static ABILITIES_ON_GCD = [
    SPELLS.AGONY.id,
    SPELLS.CORRUPTION_CAST.id,
    SPELLS.DEMONIC_GATEWAY_CAST.id,
    SPELLS.DRAIN_SOUL.id,
    SPELLS.HEALTH_FUNNEL_CAST.id,
    SPELLS.LIFE_TAP.id,
    SPELLS.REAP_SOULS.id,
    SPELLS.SEED_OF_CORRUPTION_DEBUFF.id,
    SPELLS.SOULSTONE.id,
    SPELLS.UNENDING_RESOLVE.id,
    SPELLS.UNSTABLE_AFFLICTION_CAST.id,
    //talents
    SPELLS.HAUNT.id,
    SPELLS.DEMONIC_CIRCLE_SUMMON.id,
    SPELLS.DEMONIC_CIRCLE_TELEPORT.id,
    SPELLS.MORTAL_COIL.id,
    SPELLS.PHANTOM_SINGULARITY.id,
    SPELLS.SOUL_HARVEST.id,
    SPELLS.BURNING_RUSH.id,
    SPELLS.SIPHON_LIFE.id,
    //practically unused, for the sake of completeness
    SPELLS.SUMMON_DOOMGUARD_TALENTED.id,
    SPELLS.SUMMON_INFERNAL_TALENTED.id,
    SPELLS.DARK_PACT.id,
    SPELLS.SUMMON_DOOMGUARD_UNTALENTED.id,
    SPELLS.SUMMON_INFERNAL_UNTALENTED.id,
    SPELLS.GRIMOIRE_OF_SACRIFICE_BUFF.id,
    SPELLS.HOWL_OF_TERROR_TALENT.id,
    SPELLS.GRIMOIRE_IMP.id,
    SPELLS.GRIMOIRE_VOIDWALKER.id,
    SPELLS.GRIMOIRE_FELHUNTER.id,
    SPELLS.GRIMOIRE_SUCCUBUS.id,
  ];

  on_initialized() {
    super.on_initialized();
  }

  suggestions(when) {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;

    when(deadTimePercentage).isGreaterThan(0.2)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>Your dead GCD time can be improved. Try to Always Be Casting (ABC), try to reduce the delay between casting spells. Even if you have to move, try casting something instant - maybe refresh your dots or replenish your mana with <SpellLink id={SPELLS.LIFE_TAP.id}/></span>)
          .icon('spell_mage_altertime')
          .actual(`${formatPercentage(deadTimePercentage)}% dead GCD time`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(recommended + 0.15).major(recommended + 0.2);
      });
  }
  statistic() {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;

    return (
      <StatisticBox
        icon={<Icon icon='petbattle_health-down' alt='Dead time' />}
        value={`${formatPercentage(deadTimePercentage)} %`}
        label='Dead time'
        tooltip='Dead time is available casting time not used for casting any spell. This can be caused by latency, cast interrupting, not casting anything (e.g. due to movement/being stunned), etc.'
      />
    );
  }

  statisticOrder = STATISTIC_ORDER.CORE(1);
}

export default AlwaysBeCasting;
