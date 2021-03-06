import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatNumber } from 'common/format';

import Module from 'Parser/Core/Module';

import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';

const debug = false;

class RenewingMist extends Module {
  remApplyTimestamp = null;
  remRemoveTimestamp = null;
  remCastTimestamp = null;
  dancingMistProc = 0;
  remTicks = 0;
  castsREM = 0;
  remCount = 0;
  dancingMistTarget = [];
  dancingMistHeal = 0;

  on_initialize() {
    if(!this.owner.error) {
      this.active = this.selectedCombatant.traitsBySpellId[SPELLS.DANCING_MISTS.id] === 1;
    }
  }

  on_byPlayer_applybuff(event) {
    const spellId = event.ability.guid;

    if(spellId === SPELLS.RENEWING_MIST_HEAL.id) {
      // Buffer time added to account for the buff being removed and replicating to a new target.  Testing 100ms for now.
      debug && console.log('Last Applied Timestamp: ' + this.remApplyTimestamp + ' / Current Event Timestamp: ' + event.timestamp);
      if((event.timestamp - this.remRemoveTimestamp) <= 100 || this.remCastTimestamp === event.timestamp || this.remApplyTimestamp === event.timestamp) {
        debug && console.log('REM Applied Ok. Timestamp: ' + event.timestamp + ' Target ID: ', event.targetID);
      } else {
        debug && console.log('REM Applied without Cast / Jump. Timestamp: ' + event.timestamp);
        debug && console.log('Target ID ' + event.targetID);
        this.dancingMistProc++;
        this.dancingMistTarget.push(event.targetID);
        debug && console.log('Dancing Mist Targets: ' + this.dancingMistTarget);
      }
      this.remApplyTimestamp = event.timestamp;
      this.remCount++;
    }
  }

  on_byPlayer_removebuff(event) {
    const spellId = event.ability.guid;

    this.dancingMistTarget.forEach(targetID => {
      if(event.targetID === targetID) {
        debug && console.log('Dancing Mist REM Removed: ' + targetID + ' / Timestamp: ' + event.timestamp);
        const removeValue = this.dancingMistTarget.indexOf(targetID);
        this.dancingMistTarget.splice(removeValue, 1);
        debug && console.log('Dancing Mist Targets: ', this.dancingMistTarget);
      }
    });
    if(spellId === SPELLS.RENEWING_MIST_HEAL.id) {
      this.remRemoveTimestamp = event.timestamp;
      this.remCount--;
    }
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;

    if(spellId === SPELLS.RENEWING_MIST.id || spellId === SPELLS.LIFE_COCOON.id) {
      // Added because the buff application for REM can occur either before or after the cast.
      if(event.timestamp === this.remApplyTimestamp) {
        this.dancingMistProc--;
        debug && console.log('Dancing Mist Proc Removed / Timestamp: ' + event.timestamp);
      }
      this.castsREM++;
      this.remCastTimestamp = event.timestamp;
    }
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;

    if(spellId === SPELLS.RENEWING_MIST_HEAL.id) {
      this.remTicks++;
      this.dancingMistTarget.forEach(targetID => {
        if(event.targetID === targetID) {
          debug && console.log('Dancing Mist Heal on: ' + targetID);
          this.dancingMistHeal += (event.amount || 0 ) + (event.absorbed || 0);
        }
      });
    }
  }

  on_finished() {
    if(debug) {
      console.log('Dancing Mist Procs: ' + this.dancingMistProc);
      console.log('REM Ticks: ' + this.remTicks);
      console.log('REM Casts: ' + this.castsREM);
      console.log('REM Count Out: ' + this.remCount);
      console.log('Dancing Mist Healing ' + this.dancingMistHeal);
    }
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.DANCING_MISTS.id} />}
        value={`${formatNumber(this.dancingMistHeal)}`}
        label={(
          <dfn data-tip={`You had a total of ${(this.dancingMistProc)} procs on ${this.castsREM} REM casts.`}>
            Total Healing
          </dfn>
        )}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.OPTIONAL();
}

export default RenewingMist;
