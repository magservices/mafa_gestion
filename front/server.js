const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  // transports: ['websocket', 'polling'] // Assure que le serveur accepte les WebSockets
});

const PORT = 3001; // Assurez-vous que ce port est ouvert et non utilisé

// Configuration CORS
app.use(cors({
  origin: '*', // Modifiez cela en fonction des besoins de sécurité
}));

// Middleware pour parser les données JSON
app.use(bodyParser.json());

// Route pour recevoir les notifications de Symfony
app.post('/api/webhook/notify', (req, res) => {
  console.log('Webhook received:', req.body);

  // Émettre la notification à tous les clients connectés via Socket.IO
  io.emit('notification', req.body);

  res.status(200).send('Notification received');
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
