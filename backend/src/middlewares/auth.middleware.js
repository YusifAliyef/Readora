const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Frontend-dən gələn headers-dən tokeni tuturuq
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Giriş qadağandır. Token tapılmadı" });
    }

    try {
        // Tokeni yoxlayırıq
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Token içindəki istifadəçi məlumatlarını req.user-ə mənimsədirik (lazım ola bilər)
        req.user = decoded; 
        
        next(); // Hər şey qaydasındadırsa, Controller-ə keçməyə icazə ver
    } catch (error) {
        return res.status(401).json({ message: "Etibarsız və ya vaxtı bitmiş token" });
    }
};

module.exports = authMiddleware;