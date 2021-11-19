const express = require('express')
const app = express()
const port = 3000
const user = require('./routes/user.routes')
const mssql = require('mssql')
const { sqlConfig } = require('./config/db')


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use(express.json());
app.use(express.urlencoded());
mssql.connect(sqlConfig).then(pool =>{
    if(pool.connected){
    console.log("Connected")}}
);

app.use('/user', user);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})