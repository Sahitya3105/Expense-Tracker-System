const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());
app.use(express.static('public'))

app.use(userRouter);

const PORT=5000
app.listen(PORT,()=>{
    console.log(`Server is running on address http://localhost:${PORT}`);
});