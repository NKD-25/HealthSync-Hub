const socketHandler = (io) => {
  // Store user socket mappings
  const userSockets = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins their personal room
    socket.on('join', (userId) => {
      socket.join(userId);
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} joined room ${userId}`);
    });

    // Emit new report to specific patient
    socket.on('report-uploaded', (data) => {
      const { patientId, report } = data;
      // Send real-time notification to patient
      io.to(patientId).emit('new-report', report);
      console.log(`Report sent to patient ${patientId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Remove user from mapping
      for (let [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
