/**
 * Fetches and validates portfolio.json
 * Throws explicit errors in development if any required fields are missing.
 */
export async function loadPortfolio() {
  const url = '/portfolio.json';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`[loadPortfolio] Failed to fetch ${url} (HTTP ${response.status}: ${response.statusText})`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error(`[loadPortfolio] Failed to parse JSON from ${url}: ${err.message}`);
  }

  // Top-level schema validation
  const requiredTopLevel = ['meta', 'education', 'experience', 'categories', 'projects'];
  for (const field of requiredTopLevel) {
    if (!data[field]) {
      throw new Error(`[loadPortfolio] Critical validation failure: missing top-level field '${field}' in portfolio.json`);
    }
  }

  // Validate categories
  if (typeof data.categories !== 'object' || Object.keys(data.categories).length === 0) {
    throw new Error(`[loadPortfolio] 'categories' must be an object with defined category keys.`);
  }

  // Validate each project
  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    throw new Error(`[loadPortfolio] 'projects' must be a non-empty array.`);
  }

  const requiredProjectFields = [
    'id',
    'name',
    'category',
    'tier',
    'stack',
    'problem',
    'architecture',
    'metrics',
    'primaryMetricForNodeSize'
  ];

  data.projects.forEach((proj, index) => {
    const projLabel = proj.id || `Project at index ${index}`;
    
    for (const field of requiredProjectFields) {
      if (proj[field] === undefined || proj[field] === null) {
        throw new Error(
          `[loadPortfolio] Project validation failure: '${projLabel}' is missing required field '${field}'.`
        );
      }
    }

    if (!data.categories[proj.category]) {
      throw new Error(
        `[loadPortfolio] Project '${projLabel}' references unknown category '${proj.category}'. Known categories: ${Object.keys(data.categories).join(', ')}`
      );
    }

    if (!Array.isArray(proj.stack)) {
      throw new Error(`[loadPortfolio] Project '${projLabel}': 'stack' must be an array.`);
    }

    if (!Array.isArray(proj.architecture)) {
      throw new Error(`[loadPortfolio] Project '${projLabel}': 'architecture' must be an array.`);
    }

    if (!Array.isArray(proj.metrics)) {
      throw new Error(`[loadPortfolio] Project '${projLabel}': 'metrics' must be an array.`);
    }

    if (typeof proj.primaryMetricForNodeSize !== 'number') {
      throw new Error(`[loadPortfolio] Project '${projLabel}': 'primaryMetricForNodeSize' must be a number.`);
    }
  });

  return data;
}
