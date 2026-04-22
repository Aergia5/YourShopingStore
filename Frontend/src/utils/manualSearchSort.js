export function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}

export function containsSubstring(text, query) {
  const source = normalizeText(text);
  const target = normalizeText(query);

  if (target.length === 0) return true;
  if (target.length > source.length) return false;

  for (let i = 0; i <= source.length - target.length; i += 1) {
    let matched = true;

    for (let j = 0; j < target.length; j += 1) {
      if (source[i + j] !== target[j]) {
        matched = false;
        break;
      }
    }

    if (matched) return true;
  }

  return false;
}

function compareTextValues(left, right) {
  const a = normalizeText(left);
  const b = normalizeText(right);
  const minLength = a.length < b.length ? a.length : b.length;

  for (let i = 0; i < minLength; i += 1) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }

  if (a.length < b.length) return -1;
  if (a.length > b.length) return 1;
  return 0;
}

function compareNumberValues(left, right) {
  const a = Number(left || 0);
  const b = Number(right || 0);

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function compareDateValues(left, right) {
  const a = new Date(left || 0).getTime();
  const b = new Date(right || 0).getTime();

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function extractCategoryName(product) {
  return product?.categoryId?.name || product?.category || "";
}

export function manualSearchProducts(products, query) {
  const items = Array.isArray(products) ? products : [];
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [...items];
  }

  const results = [];

  for (let i = 0; i < items.length; i += 1) {
    const product = items[i];
    const searchableFields = [
      product?.name || "",
      product?.description || "",
      extractCategoryName(product),
    ];

    let matched = false;

    for (let j = 0; j < searchableFields.length; j += 1) {
      if (containsSubstring(searchableFields[j], normalizedQuery)) {
        matched = true;
        break;
      }
    }

    if (matched) {
      results.push(product);
    }
  }

  return results;
}

function shouldSwap(left, right, sortOption) {
  switch (sortOption) {
    case "name-asc":
      return compareTextValues(left?.name, right?.name) > 0;
    case "name-desc":
      return compareTextValues(left?.name, right?.name) < 0;
    case "price-asc":
      return compareNumberValues(left?.price, right?.price) > 0;
    case "price-desc":
      return compareNumberValues(left?.price, right?.price) < 0;
    case "latest":
    default:
      return compareDateValues(left?.createdAt, right?.createdAt) < 0;
  }
}

export function bubbleSortProducts(products, sortOption = "latest") {
  const items = Array.isArray(products) ? [...products] : [];

  for (let i = 0; i < items.length - 1; i += 1) {
    let swapped = false;

    for (let j = 0; j < items.length - 1 - i; j += 1) {
      if (shouldSwap(items[j], items[j + 1], sortOption)) {
        const temp = items[j];
        items[j] = items[j + 1];
        items[j + 1] = temp;
        swapped = true;
      }
    }

    if (!swapped) {
      break;
    }
  }

  return items;
}
