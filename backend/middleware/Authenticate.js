// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//     try {
//         const header = req.headers.authorization || "";
//         console.log("Auth header seen by server: ", header);
//         const [scheme, token] = header.split(" ");

//         if (!header) {
//             return res.status(401).json({
//                 status: 401,
//                 message: "Missing header."
//             })
//         }
//         if (scheme !== "Bearer" || !token) {
//             return res.status(401).json({ status: 401, message: "Unauthorized" });
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Normalize id types and provide both id & user_id for convenience
//         if (decoded && typeof decoded.id !== "undefined") {
//             decoded.id = Number(decoded.id);
//             if (typeof decoded.user_id === "undefined") {
//                 decoded.user_id = decoded.id;
//             }
//         }

//         req.user = decoded;
//         next();
//     } catch {
//         return res.status(401).json({ status: 401, message: "Unauthorized" });

//     }
// }
// export default authMiddleware;


import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1) Allow preflight (CORS) without auth
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    const raw = req.headers.authorization || req.headers.Authorization || "";
    // Log once at debug level if you have a logger; avoid printing full token in prod
    // console.debug("Auth header:", raw ? raw.split(" ")[0] + " ****" : "<none>");

    if (!raw || typeof raw !== "string") {
      return res.status(401).json({ status: 401, message: "Missing Authorization header." });
    }

    // 2) Be robust to extra spaces and case-insensitive scheme
    //    Accept: "Bearer <token>" (preferred) and tolerate case differences.
    const parts = raw.trim().split(/\s+/);
    const scheme = parts[0];
    const token = parts[1];

    if (!/^Bearer$/i.test(scheme) || !token) {
      return res.status(401).json({ status: 401, message: "Invalid Authorization format. Use: Bearer <token>" });
    }

    // 3) Verify with configured secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Fail loudly—this is a server misconfig, not the client's fault
      return res.status(500).json({ status: 500, message: "Server auth misconfiguration." });
    }

    const decoded = jwt.verify(token, secret);

    // 4) Normalize ids for convenience
    if (decoded && typeof decoded.id !== "undefined") {
      decoded.id = Number(decoded.id);
      if (typeof decoded.user_id === "undefined") decoded.user_id = decoded.id;
    }

    req.user = decoded;
    next();
  } catch (err) {
    // Helpful diagnostics in development; keep messages generic in prod
    // console.error("JWT verify failed:", err?.name, err?.message);
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }
};

export default authMiddleware;