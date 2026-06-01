export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: 'Acceso no permitido para este rol' });
            return;
        }
        next();
    };
}
