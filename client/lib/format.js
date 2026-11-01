export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
export const dateTime = (d) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
export const date = (d) => new Date(d).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });
