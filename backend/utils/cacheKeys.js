// backend/utils/cacheKeys.js
import crypto from 'crypto';

export const userTeamsKey = (userId) => `u:${userId}:teams:v1`;
export const teamDetailsKey = (teamId) => `team:${teamId}:details:v1`;

// For listMembers: depends on dept + creator + domainIds
export function membersKey({ departmentId, creatorUserId, domainIds = [] }) {
  const toHash = JSON.stringify({
    d: departmentId ?? null,
    c: creatorUserId ?? null,
    dom: [...domainIds].sort((a,b)=>a-b),
  });
  const h = crypto.createHash('sha1').update(toHash).digest('hex').slice(0,12);
  return `members:${h}:v1`;
}
