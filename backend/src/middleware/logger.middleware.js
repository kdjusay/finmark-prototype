// Logger middleware
const logger = (req, res, next) => {
  const start = new Date();
  const { method, originalUrl, ip } = req;
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - IP: ${ip}`);
  
  // Capture response
  const originalSend = res.send;
  res.send = function(body) {
    const duration = new Date() - start;
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`);
    
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = logger;
