import React from 'react';
import { formatPercentage } from 'common/format';
import SpellIcon from 'common/SpellIcon';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import SPELLS from 'common/SPELLS';
import Module from 'Parser/Core/Module';

class IronFurGoEProcs extends Module {
  on_initialized() {
    if (!this.owner.error) {
      this.active = this.owner.selectedCombatant.hasTalent(SPELLS.GUARDIAN_OF_ELUNE_TALENT.id);
    }
  }

  statistic() {
    const nonGoEIronFur = this.owner.modules.guardianOfEluneProcs.nonGoEIronFur;
    const GoEIronFur = this.owner.modules.guardianOfEluneProcs.GoEIronFur;
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.IRONFUR.id} />}
        value={`${formatPercentage(nonGoEIronFur/(nonGoEIronFur + GoEIronFur))}%`}
        label='Unbuffed Ironfur'
        tooltip={`You cast <b>${nonGoEIronFur + GoEIronFur}</b> total ${SPELLS.IRONFUR.name} and <b>${GoEIronFur}</b> were buffed by 2s.`}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(9);
}
  
export default IronFurGoEProcs;
