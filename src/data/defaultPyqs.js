// Official K.R. Mangalam University (KRMU) Question Papers Vault Data
// All demo showcase papers have been permanently removed.
// The vault now strictly contains real papers dropped and uploaded by students and faculty.

export const DEFAULT_PYQS = [];

export function isDefaultPaper(paperOrId) {
  if (!paperOrId) return false;
  if (typeof paperOrId === 'object') {
    return Boolean(
      paperOrId.isDemo || 
      paperOrId.isShowcaseDemo || 
      String(paperOrId.id).startsWith('krmu-pyq-') || 
      String(paperOrId.id).startsWith('krmu-paper-')
    );
  }
  const idStr = String(paperOrId);
  return idStr.startsWith('krmu-pyq-') || idStr.startsWith('krmu-paper-');
}
