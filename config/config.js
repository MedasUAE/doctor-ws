module.exports = {
    name: "medasAPI",
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || "http://localhost:3000",
    db:{
        host: 'localhost',
        user: 'root',
        password : 'Medas@123',
        port : 3306, //port mysql
        database:'eclinic_ghi'
    }
}