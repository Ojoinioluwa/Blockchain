const API_BASE = "http://localhost:3001/api/aml";

export const getLogs = async () => {
    const res = await fetch(`${API_BASE}/reports`);
    return res.json();
};

export const registerUser = async (data: any) => {
    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const transferFunds = async (data: any) => {
    const res = await fetch(`${API_BASE}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};