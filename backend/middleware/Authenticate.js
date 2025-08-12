import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        console.log("Auth header seen by server: ", header);
        const [scheme, token] = header.split(" ");

        if (!header) {
            return res.status(401).json({
                status: 401,
                message: "Missing header."
            })
        }
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({ status: 401, message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Normalize id types and provide both id & user_id for convenience
        if (decoded && typeof decoded.id !== "undefined") {
            decoded.id = Number(decoded.id);
            if (typeof decoded.user_id === "undefined") {
                decoded.user_id = decoded.id;
            }
        }

        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ status: 401, message: "Unauthorized" });

    }
}
export default authMiddleware;