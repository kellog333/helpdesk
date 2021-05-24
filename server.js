const express = require('express');
const connectDB = require('./config/db');

const app = express();
const path = require('path');

connectDB();

// Middleware
app.use(express.json({ extended: false }));


// API Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/tickets', require('./routes/api/tickets'));
app.use('/api/stats', require('./routes/api/stats'));
app.use('/api/customers', require('./routes/api/customers'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/settings', require('./routes/api/settings'));
app.use('/api/stats', require('./routes/api/stats'));
app.use('/api/invitations', require('./routes/api/invitations'));
app.use('/api/settings', require('./routes/api/settings'));
app.use('/api/client', require('./routes/api/client'));

// Serve static assets in production
if(process.env.NODE_ENV == 'production') {
    app.use(express.static('frontside/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontside', 'build', 'index.html'))
    })
}

// app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))