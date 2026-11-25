module.exports = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id должен быть положительным числом' });
  }
  req.id = id;
  next();
};