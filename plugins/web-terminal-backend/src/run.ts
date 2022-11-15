/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  errorHandler,
  getRootLogger,
  notFoundHandler,
  requestLoggingHandler,
} from '@backstage/backend-common';
import yn from 'yn';
import express from 'express';
import WebSocketServer from 'ws';

const port = process.env.PLUGIN_PORT ? Number(process.env.PLUGIN_PORT) : 7007;
const enableCors = yn(process.env.PLUGIN_CORS, { default: false });
const logger = getRootLogger();

const app = express();

app.use(requestLoggingHandler());
app.use(notFoundHandler());
app.use(errorHandler());
const server = app.listen(port, () => {
  getRootLogger().info(`Listening on port ${port}`);
});
const wss = new WebSocketServer.Server({ noServer: true });
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
  wss.on('connection', ws => {
    ws.on('message', message => {
      logger.info(`Received message => ${message}`);
    });
    ws.send('Hello!');
  });
});
process.on('SIGINT', () => {
  logger.info('CTRL+C pressed; exiting.');
  process.exit(0);
});
