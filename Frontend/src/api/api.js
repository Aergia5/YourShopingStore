const BASE_URL = "";

/** Empty string = same origin; in dev, Vite proxies /api → backend. Set VITE_API_BASE_URL in production if the API is on another host. */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const STORAGE_KEY = "yss_local_db";

const DEMO_USER = {
  id: "user-demo",
  name: "Demo User",
  email: "demo@example.com",
  phone: "9800000001",
  password: "123456",
  role: "user",
  addresses: [
    {
      id: "addr-demo-1",
      fullName: "Demo User",
      street: "Baluwatar Road",
      city: "Kathmandu",
      state: "Bagmati",
      postalCode: "44600",
      country: "Nepal",
      phone: "9800000001",
    },
  ],
};

const DEMO_ADMIN = {
  id: "admin-demo",
  name: "Store Admin",
  email: "admin@example.com",
  phone: "9800000002",
  password: "admin123",
  role: "admin",
  addresses: [],
};

const INITIAL_CATEGORIES = [
  { id: "cat-fruits", name: "Fruits" },
  { id: "cat-vegetables", name: "Vegetables" },
  { id: "cat-electronics", name: "Electronics" },
  { id: "cat-groceries", name: "Groceries" },
  { id: "cat-watches", name: "Watches" },
  { id: "cat-personal-care", name: "Personal Care" },
  { id: "cat-stationery", name: "Stationery" },
];

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    categoryId: "cat-fruits",
    category: "Fruits",
    name: "Premium Red Apples",
    price: 260,
    quantity: 45,
    description: "Fresh, crisp apples selected for everyday snacking and clean presentation in the redesigned storefront.",
    image: [
      { url: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-2",
    categoryId: "cat-vegetables",
    category: "Vegetables",
    name: "Organic Garden Carrots",
    price: 140,
    quantity: 60,
    description: "Bright, sweet carrots ideal for soups, salads, and weekly grocery baskets.",
    image: [
      { url: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-3",
    categoryId: "cat-electronics",
    category: "Electronics",
    name: "Noise Canceling Headphones",
    price: 8990,
    quantity: 12,
    description: "Comfortable over-ear headphones with immersive sound and a cleaner comparison experience.",
    image: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-4",
    categoryId: "cat-groceries",
    category: "Groceries",
    name: "Daily Essentials Box",
    price: 1550,
    quantity: 30,
    description: "A pantry starter pack with staples curated for easy repeat shopping.",
    image: [
      { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-5",
    categoryId: "cat-watches",
    category: "Watches",
    name: "Classic Silver Watch",
    price: 4290,
    quantity: 18,
    description: "A versatile everyday watch with a refined look and simplified product detail layout.",
    image: [
      { url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-6",
    categoryId: "cat-personal-care",
    category: "Personal Care",
    name: "Skin Care Starter Set",
    price: 1890,
    quantity: 22,
    description: "A balanced self-care bundle with a more premium storefront presentation.",
    image: [
      { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-7",
    categoryId: "cat-stationery",
    category: "Stationery",
    name: "Minimal Desk Journal",
    price: 480,
    quantity: 40,
    description: "A clean-lined notebook for work, study, and everyday planning.",
    image: [
      { url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-8",
    categoryId: "cat-electronics",
    category: "Electronics",
    name: "Portable Smart Speaker",
    price: 3290,
    quantity: 16,
    description: "Compact speaker with rich sound, quick setup, and a more polished discovery flow.",
    image: [
      { url: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1512446816042-444d64126727?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-9",
    categoryId: "cat-fruits",
    category: "Fruits",
    name: "Seasonal Banana Bunch",
    price: 120,
    quantity: 55,
    description: "Fresh bananas for smoothies, breakfasts, and quick healthy snacking.",
    image: [
      { url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-10",
    categoryId: "cat-vegetables",
    category: "Vegetables",
    name: "Farm Fresh Tomatoes",
    price: 110,
    quantity: 70,
    description: "Juicy tomatoes ideal for curries, salads, and daily kitchen prep.",
    image: [
      { url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-11",
    categoryId: "cat-electronics",
    category: "Electronics",
    name: "Wireless Mechanical Keyboard",
    price: 6490,
    quantity: 14,
    description: "Responsive typing feel with a compact layout and clean desktop style.",
    image: [
      { url: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-12",
    categoryId: "cat-groceries",
    category: "Groceries",
    name: "Premium Rice Pack",
    price: 980,
    quantity: 38,
    description: "Staple pantry rice pack for everyday family meals and restocking.",
    image: [
      { url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-13",
    categoryId: "cat-watches",
    category: "Watches",
    name: "Midnight Sport Chronograph",
    price: 5190,
    quantity: 11,
    description: "Sport-driven watch design with bold detailing and everyday wearability.",
    image: [
      { url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-14",
    categoryId: "cat-personal-care",
    category: "Personal Care",
    name: "Daily Grooming Kit",
    price: 1490,
    quantity: 27,
    description: "A practical bundle for daily care, hygiene, and routine self-maintenance.",
    image: [
      { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1601612628452-9e99ced43524?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-15",
    categoryId: "cat-stationery",
    category: "Stationery",
    name: "Creative Marker Set",
    price: 690,
    quantity: 34,
    description: "Color-rich markers for sketching, journaling, notes, and visual planning.",
    image: [
      { url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    id: "prod-16",
    categoryId: "cat-groceries",
    category: "Groceries",
    name: "Breakfast Cereal Box",
    price: 540,
    quantity: 29,
    description: "Quick morning cereal for convenient pantry planning and repeat purchases.",
    image: [
      { url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80" },
      { url: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?auto=format&fit=crop&w=900&q=80" },
    ],
  },
];

const INITIAL_DB = {
  users: [DEMO_USER, DEMO_ADMIN],
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  carts: {},
  orders: [],
  resetTokens: {},
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

const SEED_DEMO_USER_IDS = new Set([DEMO_USER.id, DEMO_ADMIN.id]);
const SEED_DEMO_USER_EMAILS = new Set([DEMO_USER.email, DEMO_ADMIN.email]);

function sanitizeToDemoAndAdminOnly(parsed) {
  const merged = {
    ...deepClone(INITIAL_DB),
    ...parsed,
  };
  merged.categories = mergeById(INITIAL_CATEGORIES, parsed.categories || []);
  merged.products = mergeById(INITIAL_PRODUCTS, parsed.products || []);

  const fromParsed = (parsed.users || []).filter((u) => SEED_DEMO_USER_IDS.has(u.id));
  const fromParsedById = new Map(fromParsed.map((u) => [u.id, u]));
  merged.users = [DEMO_USER, DEMO_ADMIN].map((seed) => {
    const found = fromParsedById.get(seed.id);
    if (!found) return deepClone(seed);
    return { ...deepClone(seed), ...found, id: seed.id, role: seed.role };
  });

  merged.carts = Object.fromEntries(
    Object.entries(merged.carts || {}).filter(([userId]) => SEED_DEMO_USER_IDS.has(userId))
  );
  merged.orders = (merged.orders || []).filter(
    (order) => order.userId && SEED_DEMO_USER_IDS.has(order.userId)
  );
  merged.resetTokens = Object.fromEntries(
    Object.entries(merged.resetTokens || {}).filter(([, email]) => SEED_DEMO_USER_EMAILS.has(email))
  );

  return merged;
}

function isUserStoreDirtyForCleanup(parsed) {
  const uids = new Set((parsed.users || []).map((u) => u.id));
  if (uids.size !== SEED_DEMO_USER_IDS.size || ![...SEED_DEMO_USER_IDS].every((id) => uids.has(id)))
    return true;
  if (Object.keys(parsed.carts || {}).some((k) => !SEED_DEMO_USER_IDS.has(k))) return true;
  if ((parsed.orders || []).some((o) => o.userId && !SEED_DEMO_USER_IDS.has(o.userId))) return true;
  return false;
}

function loadDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = deepClone(INITIAL_DB);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    const merged = sanitizeToDemoAndAdminOnly(parsed);
    if (isUserStoreDirtyForCleanup(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
    return merged;
  } catch {
    const initial = deepClone(INITIAL_DB);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function mergeById(seedItems, existingItems) {
  const map = new Map();
  [...seedItems, ...existingItems].forEach((item) => {
    map.set(item.id, item);
  });
  return Array.from(map.values());
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function success(data, status = 200) {
  return Promise.resolve({ data, status });
}

function failure(message, status = 400) {
  const error = new Error(message);
  error.response = { data: { message }, status };
  return Promise.reject(error);
}

function getStoredUserJson() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function parseJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

/**
 * "localdb" = mock DB users. "jwt" = backend login (Mongo + Twilio), cart uses `id` from token payload.
 */
function parseToken(token) {
  if (!token) return null;
  if (token === "DUMMY_TOKEN")
    return { kind: "localdb", email: DEMO_USER.email, role: "user" };
  if (token === "DUMMY_TOKEN_ADMIN")
    return { kind: "localdb", email: DEMO_ADMIN.email, role: "admin" };
  if (token.startsWith("LOCAL_TOKEN::")) {
    const [, email, role] = token.split("::");
    return { kind: "localdb", email, role: role || "user" };
  }
  const payload = parseJwtPayload(token);
  if (payload?.id) {
    const su = getStoredUserJson();
    return {
      kind: "jwt",
      id: String(payload.id),
      email: su?.email,
      role: su?.role || payload.role || "user",
    };
  }
  return null;
}

function getToken(config = {}) {
  return (
    config.headers?.Authorization?.replace("Bearer ", "") ||
    api.defaults.headers.common.Authorization?.replace("Bearer ", "") ||
    localStorage.getItem("token") ||
    ""
  );
}

function getCurrentUser(db, config) {
  const parsed = parseToken(getToken(config));
  if (!parsed) return null;
  if (parsed.kind === "jwt" && parsed.id) {
    return {
      id: parsed.id,
      email: parsed.email,
      role: parsed.role,
      password: "",
      addresses: [],
    };
  }
  if (parsed.kind === "localdb" && parsed.email) {
    return db.users.find((entry) => entry.email === parsed.email) || null;
  }
  return null;
}

function requireUser(db, config) {
  const user = getCurrentUser(db, config);
  if (!user) {
    throw {
      response: { data: { message: "Please log in first" }, status: 401 },
    };
  }
  return user;
}

function requireAdmin(db, config) {
  const user = requireUser(db, config);
  if (user.role !== "admin") {
    throw {
      response: { data: { message: "Admin access required" }, status: 403 },
    };
  }
  return user;
}

function serializeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    quantity: Number(product.quantity),
  };
}

function attachCartProduct(db, item) {
  const product = db.products.find((entry) => entry.id === item.productId);
  return {
    ...item,
    Product: product ? serializeProduct(product) : null,
  };
}

function getCartItems(db, userId) {
  return (db.carts[userId] || []).map((item) => attachCartProduct(db, item));
}

function extractBody(body) {
  if (!(body instanceof FormData)) return body;

  const imageEntries = body.getAll("images");
  return {
    categoryId: body.get("categoryId"),
    name: body.get("name"),
    price: Number(body.get("price")),
    quantity: Number(body.get("quantity")),
    image: imageEntries.length
      ? imageEntries.map((entry) => ({
          url:
            typeof entry === "string"
              ? entry
              : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
        }))
      : [
          {
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
          },
        ],
  };
}

/** Login, register, OTP, etc. go to the real Express API (Twilio SMS, Mongo). */
async function postAuthToBackend(url, body, config) {
  const token = getToken(config);
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const init = {
    method: "POST",
    headers: { ...headers },
    body: body instanceof FormData ? body : JSON.stringify(extractBody(body)),
  };
  if (body instanceof FormData) delete init.headers["Content-Type"];

  const fullUrl = `${API_BASE}${url}`;
  let res;
  try {
    res = await fetch(fullUrl, init);
  } catch (e) {
    const err = new Error(
      e?.message === "Failed to fetch"
        ? "Cannot reach the API server. Start the backend (e.g. port 5000) or set VITE_API_BASE_URL."
        : e?.message || "Network error"
    );
    err.response = { data: { message: err.message }, status: 0 };
    throw err;
  }

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || res.statusText };
  }
  if (!res.ok) {
    const err = new Error(data.message || res.statusText);
    err.response = { data, status: res.status };
    throw err;
  }
  return { data, status: res.status };
}

async function get(url, config) {
  const db = loadDb();

  if (url === "/api/products") {
    const category = config?.params?.category;
    let products = db.products.map(serializeProduct);
    if (category) {
      const normalized = String(category).trim().toLowerCase();
      products = products.filter((product) => product.category?.toLowerCase() === normalized);
    }
    return success(products);
  }

  if (url.startsWith("/api/products/")) {
    const id = url.split("/").pop();
    const product = db.products.find((entry) => entry.id === id);
    return product ? success(serializeProduct(product)) : failure("Product not found", 404);
  }

  if (url === "/api/categories") {
    return success(deepClone(db.categories));
  }

  if (url === "/api/cart") {
    const user = requireUser(db, config);
    return success({ CartItems: getCartItems(db, user.id) });
  }

  if (url === "/api/orders/my-orders") {
    const user = requireUser(db, config);
    return success(deepClone(db.orders.filter((order) => order.userId === user.id)));
  }

  if (url === "/api/orders") {
    requireAdmin(db, config);
    return success(deepClone(db.orders));
  }

  if (url === "/api/users/profile") {
    const user = requireUser(db, config);
    return success(deepClone(user));
  }

  if (url === "/api/users/addresses") {
    const user = requireUser(db, config);
    return success(deepClone(user.addresses || []));
  }

  return failure(`Unhandled GET route: ${url}`, 404);
}

async function post(url, body, config) {
  if (url.startsWith("/api/auth/")) {
    return postAuthToBackend(url, body, config);
  }

  const db = loadDb();
  const parsedBody = extractBody(body);

  if (url === "/api/categories") {
    requireAdmin(db, config);
    const category = { id: uid("cat"), name: parsedBody.name };
    db.categories.push(category);
    saveDb(db);
    return success(category, 201);
  }

  if (url === "/api/products") {
    requireAdmin(db, config);
    const category = db.categories.find((entry) => entry.id === parsedBody.categoryId);
    const product = {
      id: uid("prod"),
      categoryId: parsedBody.categoryId,
      category: category?.name || parsedBody.category || "General",
      name: parsedBody.name,
      price: Number(parsedBody.price || 0),
      quantity: Number(parsedBody.quantity || 0),
      description:
        parsedBody.description || "Locally stored product with no backend dependency.",
      image: parsedBody.image,
    };
    db.products.unshift(product);
    saveDb(db);
    return success(product, 201);
  }

  if (url === "/api/cart/add") {
    const user = requireUser(db, config);
    const { productId, quantity = 1 } = parsedBody;
    const cart = db.carts[user.id] || [];
    const existing = cart.find((entry) => entry.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: uid("cart"), productId, quantity });
    }

    db.carts[user.id] = cart;
    saveDb(db);
    return success({ CartItems: getCartItems(db, user.id) });
  }

  if (url === "/api/orders") {
    const user = requireUser(db, config);
    const items = (parsedBody.cartItems || []).map((item) => {
      const product = db.products.find((entry) => entry.id === item.productId);
      return {
        productId: deepClone(product),
        quantity: item.quantity,
        price: Number(product?.price || 0),
      };
    });

    const order = {
      id: uid("order"),
      userId: user.id,
      address: parsedBody.address,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      items,
      totalAmount: items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    };

    db.orders.unshift(order);
    db.carts[user.id] = [];
    saveDb(db);
    return success({ orderId: order.id });
  }

  if (url === "/api/payments/create-order") {
    requireUser(db, config);
    return success({
      razorpayOrder: {
        id: uid("payment"),
        amount: Math.round(Number(parsedBody.amount || 0) * 100),
        currency: "NPR",
      },
    });
  }

  if (url === "/api/payments/verify") {
    requireUser(db, config);
    return success({ success: true });
  }

  if (url === "/api/users/address") {
    const user = requireUser(db, config);
    const address = { ...parsedBody, id: uid("addr") };
    user.addresses = [...(user.addresses || []), address];
    saveDb(db);
    return success(address, 201);
  }

  return failure(`Unhandled POST route: ${url}`, 404);
}

async function put(url, body, config) {
  const db = loadDb();

  if (url.startsWith("/api/products/")) {
    requireAdmin(db, config);
    const id = url.split("/").pop();
    const product = db.products.find((entry) => entry.id === id);
    if (!product) return failure("Product not found", 404);

    Object.assign(product, {
      ...body,
      price: Number(body.price ?? product.price),
      quantity: Number(body.quantity ?? product.quantity),
    });
    saveDb(db);
    return success(product);
  }

  if (url.startsWith("/api/cart/update/")) {
    const user = requireUser(db, config);
    const id = url.split("/").pop();
    const item = (db.carts[user.id] || []).find((entry) => entry.id === id);
    if (!item) return failure("Cart item not found", 404);
    item.quantity = Number(body.quantity);
    saveDb(db);
    return success({ success: true });
  }

  if (url.startsWith("/api/orders/") && url.endsWith("/status")) {
    requireAdmin(db, config);
    const orderId = url.split("/")[3];
    const order = db.orders.find((entry) => entry.id === orderId);
    if (!order) return failure("Order not found", 404);
    order.status = body.status;
    saveDb(db);
    return success(order);
  }

  if (url === "/api/users/profile") {
    const user = requireUser(db, config);
    Object.assign(user, body);
    saveDb(db);
    return success(user);
  }

  return failure(`Unhandled PUT route: ${url}`, 404);
}

async function del(url, config) {
  const db = loadDb();

  if (url.startsWith("/api/categories/")) {
    requireAdmin(db, config);
    const id = url.split("/").pop();
    db.categories = db.categories.filter((entry) => entry.id !== id);
    saveDb(db);
    return success({ success: true });
  }

  if (url.startsWith("/api/products/")) {
    requireAdmin(db, config);
    const id = url.split("/").pop();
    db.products = db.products.filter((entry) => entry.id !== id);
    saveDb(db);
    return success({ success: true });
  }

  if (url.startsWith("/api/cart/remove/")) {
    const user = requireUser(db, config);
    const id = url.split("/").pop();
    db.carts[user.id] = (db.carts[user.id] || []).filter((entry) => entry.id !== id);
    saveDb(db);
    return success({ success: true });
  }

  if (url.startsWith("/api/users/address/")) {
    const user = requireUser(db, config);
    const id = url.split("/").pop();
    user.addresses = (user.addresses || []).filter((entry) => entry.id !== id);
    saveDb(db);
    return success({ success: true });
  }

  return failure(`Unhandled DELETE route: ${url}`, 404);
}

const api = {
  defaults: {
    headers: {
      common: {},
    },
  },
  interceptors: {
    request: {
      use: () => {},
    },
  },
  get,
  post,
  put,
  delete: del,
};

export { BASE_URL };
export default api;
