/**
 * GitHub API Service for BPPL Admin Panel
 * 
 * Allows the admin to commit product data (JSON) and images
 * directly to the GitHub repository from the browser.
 * 
 * The Personal Access Token is stored in localStorage only —
 * it is NEVER written into source code.
 */

const GITHUB_OWNER = 'dn3305';
const GITHUB_REPO = 'bppl.github.io';
const GITHUB_BRANCH = 'main';
const GITHUB_TOKEN_KEY = 'bppl_gh_token_enc';

// --- Token Management ---

export const saveGitHubToken = (token) => {
  // Simple obfuscation (NOT cryptography — this is just to avoid plain text in storage)
  const encoded = btoa(token.split('').reverse().join(''));
  localStorage.setItem(GITHUB_TOKEN_KEY, encoded);
};

export const getGitHubToken = () => {
  const stored = localStorage.getItem(GITHUB_TOKEN_KEY);
  if (!stored) return null;
  try {
    return atob(stored).split('').reverse().join('');
  } catch {
    return null;
  }
};

export const clearGitHubToken = () => {
  localStorage.removeItem(GITHUB_TOKEN_KEY);
};

export const hasGitHubToken = () => !!getGitHubToken();

// --- GitHub REST API Helpers ---

const githubHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json'
});

/**
 * Get file SHA (required for updating existing files via GitHub API)
 */
const getFileSHA = async (token, path) => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
      { headers: githubHeaders(token) }
    );
    if (res.status === 404) return null; // file doesn't exist yet
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();
    return data.sha;
  } catch (err) {
    if (err.message.includes('404')) return null;
    throw err;
  }
};

/**
 * Commit a text/JSON file to the GitHub repository
 */
const commitFile = async (token, path, content, commitMessage) => {
  const sha = await getFileSHA(token, path);
  const body = {
    message: commitMessage,
    content: btoa(unescape(encodeURIComponent(content))), // UTF-8 safe base64
    branch: GITHUB_BRANCH,
    ...(sha ? { sha } : {})
  };

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: githubHeaders(token),
      body: JSON.stringify(body)
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `GitHub commit failed: ${res.status}`);
  }

  return await res.json();
};

/**
 * Verify the GitHub token works (test API call)
 */
export const verifyGitHubToken = async (token) => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,
      { headers: githubHeaders(token) }
    );
    if (res.status === 401) return { success: false, error: 'Token is invalid or expired.' };
    if (res.status === 403) return { success: false, error: 'Token does not have repo write access.' };
    if (res.status === 404) return { success: false, error: 'Repository not found. Check repo name.' };
    if (!res.ok) return { success: false, error: `GitHub API error: ${res.status}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: `Network error: ${err.message}` };
  }
};

/**
 * Push all products to GitHub as products.json
 */
export const pushProductsToGitHub = async (products) => {
  const token = getGitHubToken();
  if (!token) throw new Error('No GitHub token configured. Please set it up in Admin Settings.');

  const jsonContent = JSON.stringify(products, null, 2);
  await commitFile(
    token,
    'bppl-react/public/data/products.json',
    jsonContent,
    `[Admin] Update product catalog — ${products.length} items`
  );

  return { success: true, productCount: products.length };
};
