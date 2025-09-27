const invidiousInstances = [
  'https://invidious.reallyaweso.me',
  'https://iv.melmac.space',
  'https://inv.vern.cc',
  'https://y.com.sb',
  'https://invidious.nikkosphere.com',
  'https://yt.omada.cafe'
];

export async function fetchWithInvidiousFallback(path: string) {
  for (const instance of invidiousInstances) {
    try {
      const url = `${instance}/api/v1/${path}`;
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Failed to fetch from ${instance}:`, error);
    }
  }
  throw new Error('All Invidious instances failed to respond.');
}
