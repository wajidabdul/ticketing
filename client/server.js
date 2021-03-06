const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require("http-proxy-middleware")

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const apiPaths = {
  '/api/users': {
    target: 'http://localhost:3001', 
    pathRewrite: {
      '^/api/users': '/api/users'
    },
    changeOrigin: true
  },
  '/api/tickets': {
    target: 'http://localhost:3002', 
    pathRewrite: {
      '^/api/tickets': '/api/tickets'
    },
    changeOrigin: true
  },
  '/api/orders': {
    target: 'http://localhost:3003', 
    pathRewrite: {
      '^/api/orders': '/api/orders'
    },
    changeOrigin: true
  },
  '/api/payments': {
    target: 'http://localhost:3004', 
    pathRewrite: {
      '^/api/payments': '/api/payments'
    },
    changeOrigin: true
  }
}

const isDevelopment = process.env.NODE_ENV !== 'production'

app.prepare().then(() => {
  const server = express()
 
  if (isDevelopment) {
    server.use('/api/users', createProxyMiddleware(apiPaths['/api/users']));
    server.use('/api/tickets', createProxyMiddleware(apiPaths['/api/tickets']));
    server.use('/api/orders', createProxyMiddleware(apiPaths['/api/orders']));
    server.use('/api/payments', createProxyMiddleware(apiPaths['/api/payments']));
  }

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
}).catch(err => {
  console.log('Error:::::', err)
})