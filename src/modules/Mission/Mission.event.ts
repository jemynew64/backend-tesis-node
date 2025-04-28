import { EventEmitter } from 'events';

export const missionEventEmitter = new EventEmitter();

missionEventEmitter.on('mission.created', (mission) => {
    console.log(`[MISSION CREATED] ID: ${mission.id}, Title: ${mission.title}`);
  });
  
  missionEventEmitter.on('mission.updated', (mission) => {
    console.log(`[MISSION UPDATED] ID: ${mission.id}`);
  });
  
  missionEventEmitter.on('mission.deleted', (missionId) => {
    console.log(`[MISSION DELETED] ID: ${missionId}`);
  });
  
  missionEventEmitter.on('mission.error', (error) => {
    console.error(`[MISSION ERROR]`, error);
  });