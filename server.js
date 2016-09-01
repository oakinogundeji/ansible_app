'use strict';
/**
 * Module Dependencies
 */
//=============================================================================
const
  http = require('http'),
  cluster = require('cluster'),
  app = require('./app');
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
const
  port = app.get('port'),
  env = app.get('env');
//=============================================================================
/**
 * Check if instance is master
 */
//=============================================================================
if(cluster.isMaster) {
    const CPUNUMs = require('os').cpus().length;
    let i;
    for(i = 0; i < CPUNUMs; i++) {
        console.log('Now forking worker number %d', i);
        cluster.fork();
        }
    cluster.on('online', worker => console.log('Worker %s is online', worker.process.pid));
    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker %s died with code: %s and signal: %s', worker.process.pid, code, signal);
        console.log('Starting a new worker');
        setTimeout(() => {
            return cluster.fork();
            }, 1000 * 5);
        });
}
//=============================================================================
else {
    /**
     * Create server instance
     */
    //=========================================================================
    const server = http.createServer(app);
    //========================================================================
    /**
     * Bind server to port
     */
    //=========================================================================
    server.listen(port, () => console.log('Textpedia server listening on port %d in %s mode', port, env));
    //=========================================================================
}
//=============================================================================
/**
 * Conditionally export module
 */
//=============================================================================
if(require.main != module) {
  module.exports = server;
}
//=============================================================================
