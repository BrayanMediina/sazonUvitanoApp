export const errorHandler = (err, _req, res, _next) => {
    const status = err.status ?? 500;
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    res.status(status).json({ success: false, message });
};
