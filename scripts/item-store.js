const ITEM_CONTENT_STORAGE_KEY = "irHesabdarItemContent";

function loadContentOverrides() {
  try {
    const raw = localStorage.getItem(ITEM_CONTENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn("item-store: خطا در خواندن localStorage", error);
    return {};
  }
}

function saveContentOverride(itemId, payload) {
  const overrides = loadContentOverrides();
  const current = overrides[itemId] || {};
  overrides[itemId] =
    typeof payload === "object" && payload.content
      ? {
          content: payload.content,
          excerpt: payload.excerpt !== undefined ? payload.excerpt : current.excerpt,
        }
      : { content: payload, excerpt: current.excerpt };
  localStorage.setItem(ITEM_CONTENT_STORAGE_KEY, JSON.stringify(overrides));
}

function removeContentOverride(itemId) {
  const overrides = loadContentOverrides();
  delete overrides[itemId];
  localStorage.setItem(ITEM_CONTENT_STORAGE_KEY, JSON.stringify(overrides));
}

function getContentOverride(itemId) {
  const saved = loadContentOverrides()[itemId];
  if (!saved) {
    return null;
  }
  return saved.content || saved;
}

function applyContentOverrides(data) {
  const overrides = loadContentOverrides();

  Object.keys(data).forEach(function (catKey) {
    const category = data[catKey];
    if (!category || !Array.isArray(category.items)) {
      return;
    }

    category.items = category.items.map(function (item) {
      const saved = overrides[item.id];
      if (!saved) {
        return item;
      }

      const patch = {
        content: saved.content || saved,
      };

      if (saved.excerpt !== undefined) {
        patch.excerpt = saved.excerpt;
      }

      return Object.assign({}, item, patch);
    });
  });

  return data;
}

function findSiteItem(itemId) {
  if (typeof siteData === "undefined") {
    return null;
  }

  for (const catKey in siteData) {
    const category = siteData[catKey];
    if (!category || !Array.isArray(category.items)) {
      continue;
    }

    const item = category.items.find(function (entry) {
      return entry.id === itemId;
    });

    if (item) {
      return {
        item: item,
        categoryKey: catKey,
        categoryTitle: category.title,
      };
    }
  }

  return null;
}

function getAllSiteItems() {
  if (typeof siteData === "undefined") {
    return [];
  }

  const rows = [];

  Object.keys(siteData).forEach(function (catKey) {
    const category = siteData[catKey];
    if (!category || !Array.isArray(category.items)) {
      return;
    }

    category.items.forEach(function (item) {
      rows.push({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt || "",
        categoryKey: catKey,
        categoryTitle: category.title,
        hasOverride: Boolean(getContentOverride(item.id)),
        hasBlocks:
          typeof getContentBlocks === "function"
            ? getContentBlocks(item).length > 0
            : Boolean(item.content),
      });
    });
  });

  return rows;
}

if (typeof module !== "undefined") {
  module.exports = {
    ITEM_CONTENT_STORAGE_KEY,
    loadContentOverrides,
    saveContentOverride,
    removeContentOverride,
    getContentOverride,
    applyContentOverrides,
    findSiteItem,
    getAllSiteItems,
  };
}
