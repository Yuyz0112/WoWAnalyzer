import SPELLS from 'common/SPELLS';

import Module from 'Parser/Core/Module';

import BeaconTargets from './BeaconTargets';
import { BEACON_TRANSFERING_ABILITIES, BEACON_TYPES } from '../../Constants';
import LightOfDawn from './LightOfDawn';

const debug = false;

class BeaconHealOriginMatcher extends Module {
  static dependencies = {
    beaconTargets: BeaconTargets,
    lightOfDawn: LightOfDawn,
  };

  on_byPlayer_heal(event) {
    this.processForBeaconHealing(event);
  }

  healBacklog = [];
  processForBeaconHealing(event) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.BEACON_OF_LIGHT.id) {
      this.processBeaconHealing(event);
      return;
    }
    const spellBeaconTransferFactor = BEACON_TRANSFERING_ABILITIES[spellId];
    if (!spellBeaconTransferFactor) {
      return;
    }

    const beaconTargets = this.beaconTargets;

    let remainingBeaconTransfers = beaconTargets.numBeaconsActive;
    if (beaconTargets.hasBeacon(event.targetID)) {
      remainingBeaconTransfers -= 1;
      debug && console.log(`${this.owner.combatants.players[event.targetID].name} has beacon, remaining beacon transfers reduced by 1 and is now ${remainingBeaconTransfers}`);
    }

    if (remainingBeaconTransfers > 0) {
      this.healBacklog.push({
        ...event,
        spellBeaconTransferFactor,
        remainingBeaconTransfers,
      });
    }
  }
  processBeaconHealing(beaconTransferEvent) {
    // This should make it near impossible to match the wrong spells as we usually don't cast multiple heals within 500ms while the beacon transfer usually happens within 100ms
    this.healBacklog = this.healBacklog.filter(healEvent => (this.owner.currentTimestamp - healEvent.timestamp) < 500);

    if (debug) {
      this.sanityChecker(beaconTransferEvent);
    }

    const matchedHeal = this.healBacklog[0];
    if (!matchedHeal) {
      console.error('No heal found for beacon transfer:', beaconTransferEvent);
      return;
    }
    // console.log('Matched beacon transfer', beaconTransferEvent, 'to heal', matchedHeal);
    this.owner.triggerEvent('beacon_heal', {
      beaconTransferEvent,
      matchedHeal,
    });

    matchedHeal.remainingBeaconTransfers -= 1;
    if (matchedHeal.remainingBeaconTransfers < 1) {
      this.healBacklog.splice(0, 1);
    }
  }

  get beaconType() {
    return this.owner.selectedCombatant.lv100Talent;
  }
  /**
   * Verify that the beacon transfer matches what we would expect. This isn't 100% reliable due to weird interactions with stuff like Blood Death Knights (Vampiric Blood and probably other things), and other healing received increasers.
   */
  sanityChecker(beaconTransferEvent) {
    const beaconTransferAmount = beaconTransferEvent.amount;
    const beaconTransferAbsorbed = beaconTransferEvent.absorbed || 0;
    const beaconTransferOverheal = beaconTransferEvent.overheal || 0;
    const beaconTransferRaw = beaconTransferAmount + beaconTransferAbsorbed + beaconTransferOverheal;
    const index = this.healBacklog.findIndex((healEvent) => {
      const expectedBeaconTransfer = this.getExpectedBeaconTransfer(healEvent, beaconTransferEvent);

      return Math.abs(expectedBeaconTransfer - beaconTransferRaw) <= 2; // allow for rounding errors on Blizzard's end
    });

    if (index === -1) {
      // Here's a fun fact for you. Fury Warriors with the legendary "Kazzalax, Fujieda's Fury" (http://www.wowhead.com/item=137053/kazzalax-fujiedas-fury)
      // get a 8% healing received increase for almost the entire fight (tooltip states it's 1%, this is a tooltip bug). What's messed up
      // is that this healing increase doesn't beacon transfer. So we won't be able to recognize the heal in here since it's off by 8%, so
      // this will be triggered. While I could implement code to track it, I chose not to because things would get way more complicated and
      // fragile and the accuracy loss for not including this kind of healing is minimal. I expect other healing received increases likely
      // also don't beacon transfer, but right now this isn't common. Fury warrior log:
      // https://www.warcraftlogs.com/reports/TLQ14HfhjRvNrV2y/#view=events&type=healing&source=10&start=7614145&end=7615174&fight=39
      console.error('Failed to match', beaconTransferEvent, 'to a heal. Healing backlog:', this.healBacklog, '-', (beaconTransferEvent.timestamp - this.owner.fight.start_time) / 1000, 'seconds into the fight');
      this.healBacklog.forEach((healEvent, i) => {
        const expectedBeaconTransfer = this.getExpectedBeaconTransfer(healEvent, beaconTransferEvent);

        console.log(i, {
          ability: healEvent.ability.name,
          healEvent,
          raw: healEvent.amount + (healEvent.absorbed || 0) + (healEvent.overheal || 0),
          expectedBeaconTransfer,
          actual: beaconTransferRaw,
          difference: Math.abs(expectedBeaconTransfer - beaconTransferRaw),
          beaconTransferFactor: this.getBeaconTransferFactor(healEvent),
          spellBeaconTransferFactor: healEvent.spellBeaconTransferFactor,
        });
      });
    } else if (index !== 0) {
      const matchedHeal = this.healBacklog[index];
      if (index !== 0) {
        console.warn('Matched', beaconTransferEvent, 'to', matchedHeal, 'but it wasn\'t the first heal in the Backlog. Something is likely wrong.', this.healBacklog);
      }
      this.healBacklog.forEach((healEvent, i) => {
        const expectedBeaconTransfer = this.getExpectedBeaconTransfer(healEvent, beaconTransferEvent);

        console.log(i, {
          ability: healEvent.ability.name,
          healEvent,
          raw: healEvent.amount + (healEvent.absorbed || 0) + (healEvent.overheal || 0),
          expectedBeaconTransfer,
          actual: beaconTransferRaw,
          difference: Math.abs(expectedBeaconTransfer - beaconTransferRaw),
          beaconTransferFactor: this.getBeaconTransferFactor(healEvent),
          spellBeaconTransferFactor: healEvent.spellBeaconTransferFactor,
        });
      });
    }
  }

  getBeaconTransferFactor(healEvent) {
    let beaconFactor = 0.4;

    // Light's Embrace (4PT2)
    // What happens here are 2 situations:
    // - Light of Dawn applies Light's Embrace, it acts a bit weird though since the FIRST heal from the cast does NOT get the increased beacon transfer, while all sebsequent heals do (even when the combatlog has't fired the Light's Embrace applybuff event yet). The first part checks for that. The combatlog looks different when the first heal is a self heal vs they're all on other people, but in both cases it always doesn't apply to the first LoD heal and does for all subsequent ones.
    // - If a FoL or something else is cast right before the LoD, the beacon transfer may be delayed until after the Light's Embrace is applied. This beacon transfer does not appear to benefit. My hypothesis is that the server does healing and buffs async and there's a small lag between the processes, and I think 50ms should be about the time required.
    const hasLightsEmbrace = (healEvent.ability.guid === SPELLS.LIGHT_OF_DAWN_HEAL.id && healEvent.lightOfDawnHealIndex > 0) || this.owner.selectedCombatant.hasBuff(SPELLS.LIGHTS_EMBRACE_BUFF.id, null, 0, 100);
    if (hasLightsEmbrace) {
      beaconFactor += 0.4;
    }

    if (this.beaconType === BEACON_TYPES.BEACON_OF_FATH) {
      beaconFactor *= 0.8;
    }

    return beaconFactor;
  }
  getExpectedBeaconTransfer(healEvent, beaconTransferEvent) {
    const amount = healEvent.amount;
    const absorbed = healEvent.absorbed || 0;
    const overheal = healEvent.overheal || 0;
    let raw = amount + absorbed + overheal;

    const healTargetId = healEvent.targetID;
    const healCombatant = this.owner.combatants.players[healTargetId];
    if (healCombatant) {
      if (healCombatant.hasBuff(SPELLS.PROTECTION_OF_TYR.id, healEvent.timestamp)) {
        raw /= 1.15;
      }
      if (healCombatant.hasBuff(55233, healEvent.timestamp)) {
        raw /= 1.3;
      }
    }

    let expectedBeaconTransfer = Math.round(raw * this.getBeaconTransferFactor(healEvent) * healEvent.spellBeaconTransferFactor);

    const beaconTargetId = beaconTransferEvent.targetID;
    const beaconCombatant = this.owner.combatants.players[beaconTargetId];
    if (beaconCombatant) {
      if (beaconCombatant.hasBuff(55233, healEvent.timestamp)) {
        expectedBeaconTransfer *= 1.3;
      }
    }

    return expectedBeaconTransfer;
  }
}

export default BeaconHealOriginMatcher;
