// Preloaded and dynamically created Anonymous Study Groups for KRMU
// All demo/default squads have been permanently removed per policy.
// Squads are strictly populated only when real students create a new secret squad.
export const DEFAULT_GROUPS = [];

export const isDefaultGroup = (grpOrId) => {
  if (!grpOrId) return false;
  const id = typeof grpOrId === 'string' ? grpOrId : grpOrId.id;
  if (!id) return false;
  const strId = String(id).toLowerCase().trim();
  return (
    strId === 'group-soet-cse-2024' ||
    strId === 'group-sols-law-squad' ||
    strId === 'group-somc-bba-mba' ||
    strId === 'group-smas-pharma' ||
    strId === 'group-hostel-secret'
  );
};

// All default paper requests have been permanently removed.
// Requests are strictly populated only when real students post a request.
export const DEFAULT_REQUESTS = [];

export const isDefaultRequest = (reqOrId) => {
  if (!reqOrId) return false;
  const id = typeof reqOrId === 'string' ? reqOrId : reqOrId.id;
  if (!id) return false;
  const strId = String(id).toLowerCase().trim();
  return (
    strId === 'req-1' ||
    strId === 'req-2' ||
    strId === 'req-3' ||
    Boolean(reqOrId.isDefault) ||
    Boolean(reqOrId.isDemo)
  );
};
