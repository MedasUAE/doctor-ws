module.exports = {
    name: "medasAPI",
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || "http://localhost:3000",
    db:{
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password : process.env.DB_PSW || '',
        port : process.env.DB_PORT || 3306, //port mysql
        //database:process.env.DB_NAME || 'eclinic_samc'
        database:process.env.DB_NAME || 'eclinic_hmc'
      
    },

    // db: {
    //     host: process.env.DB_HOST || '192.168.0.25',
    //     user: process.env.DB_USER || 'medas',
    //     password: process.env.DB_PSW || 'medteam2013',
    //     port: process.env.DB_PORT || 3306, //port mysql
    //     database: process.env.DB_NAME || 'eclinic_ghi_live'
    // },
    redis_port: 6379,
    redis_host: "127.0.0.1"

    // db: {
    //     host: process.env.DB_HOST || 'db4free.net',
    //     user: process.env.DB_USER || 'test_cubezix',
    //     password: process.env.DB_PSW || 'test@1234',
    //     port: process.env.DB_PORT || 3306, //port mysql
    //     database: process.env.MYSQLDB || 'cubezix'
       
    //  },
    
   // mysqlConn:process.env.MYSQLCONN || "mysql://test_cubezix:test@1234@db4free.net:3306/cubezix"
 
}