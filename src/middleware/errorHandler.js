function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] Ошибка:`, err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: `Файл слишком большой. Максимальный размер: ${config.maxFileSize / 1024 / 1024}MB`
    });
  }

  if (err.message.includes('Недопустимый тип файла')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера'
  });
}

module.exports = errorHandler;