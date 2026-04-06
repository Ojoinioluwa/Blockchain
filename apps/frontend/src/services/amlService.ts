// const API_BASE = "http://localhost:3001/api/aml";
const API_BASE = "https://blockchain-0fsd.onrender.com/api/aml";

/**
 * Helper to convert a flat object into a URL query string
 */
const buildQuery = (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString());
        }
    });
    return searchParams.toString();
};

// --- USER & REGISTRATION ---

export const registerUser = async (data: any) => {
    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const listUsers = async (filters = {}) => {
    const query = buildQuery(filters);
    const res = await fetch(`${API_BASE}/users?${query}`);
    return res.json();
};

// --- TRANSACTIONS & MONITORING ---

export const transferFunds = async (data: any) => {
    const res = await fetch(`${API_BASE}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const getAuditLogs = async (filters = {}) => {
    const query = buildQuery(filters);
    const res = await fetch(`${API_BASE}/transactions?${query}`);
    return res.json();
};

// --- BLACKLIST MANAGEMENT ---

export const listBlacklist = async (filters = {}) => {
    const query = buildQuery(filters);
    const res = await fetch(`${API_BASE}/blacklist?${query}`);
    return res.json();
};

export const addToBlacklist = async (data: { walletAddress: string, reason: string, severity?: string }) => {
    const res = await fetch(`${API_BASE}/blacklist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const removeFromBlacklist = async (walletAddress: string) => {
    const res = await fetch(`${API_BASE}/blacklist/remove`, {
        method: "POST", // Using POST as per your controller logic
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
    });
    return res.json();
};

// --- SANCTIONS MANAGEMENT ---

export const listSanctionedCountries = async (filters = {}) => {
    const query = buildQuery(filters);
    const res = await fetch(`${API_BASE}/sanctions?${query}`);
    return res.json();
};

/**
 * Note: Add an endpoint in your backend routes for this if not yet defined
 * to match the functionality of the "Add Sanctioned Country" form.
 */
export const RemoveFromSanctions = async (id: string) => {
    const res = await fetch(`${API_BASE}/sanctions/remove/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: id,
    });
    return res.json();
};
export const AddToSanctions = async (data: { country: string, restriction: string }) => {
    const res = await fetch(`${API_BASE}/sanctions/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};