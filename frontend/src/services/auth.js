import api from "@/lib/api";

function normalizeSignup(data) {
  const fName = (data.fName ?? data.firstName ?? "").trim();
  const lName = (data.lName ?? data.lastName ?? "").trim();
  const email = (data.email ?? "").trim();
  const password = data.password ?? "";
  const teacherCode = data.teacherCode ?? "";

  if (!fName || !lName || !email || !password) {
    throw new Error("Please complete all required fields.");
  }
  return { firstName: fName, lastName: lName, email, password, teacherCode };
}

export async function login(data) {
  const { data: user } = await api.post("/auth/login", {
    email: (data.email ?? "").trim(),
    password: data.password ?? "",
  });
  if (user?.token) localStorage.setItem("bm_token", user.token);
  localStorage.setItem("bm_user", JSON.stringify(user));
  return user;
}

export async function signup(data) {
  const payload = normalizeSignup(data);
  const { data: user } = await api.post("/users", payload);
  if (user?.token) localStorage.setItem("bm_token", user.token);
  localStorage.setItem("bm_user", JSON.stringify(user));
  return user;
}

export async function me() {
  const { data } = await api.get("/users/me");
  return data;
}

export function logout() {
  // Clear authentication data from localStorage
  localStorage.removeItem("bm_token");
  localStorage.removeItem("bm_user");

  // Redirect to landing page
  window.location.href = "/";
}
