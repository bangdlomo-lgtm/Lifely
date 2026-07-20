const sql = require("mssql/msnodesqlv8");
const experss = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const app = experss();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(experss.static(path.join(__dirname, "public")));
app.listen(3000, () => {
    console.log('API server running on localhost:${3000}');
    
});
const config = {
    conneectionString:
    "Driver={OOBC Driver 18 for SQL Server};Server=bangslaptop;Database=PublicHospitals;Trusted_Connection=Yes;"
};
sql.connect(config, function (err) {
    if (err) console.error(err);
    var request = new sql.Request();
    console.log("Connected using Windows Authentication"); 
        request.query("SELECT * FROM PublicHospitals", function (err, records) {
            if (err) console.log(err);
            else console.log(records);
        });

 });

// get data from the database
app.get("/Username", (req, res) => {
    const request = new sql.Request();
    request.query("SELECT * FROM PublicHospitals", (err, result) => {
        if (err) {
            console.error("Query failed:", err);
            return res.status(500).send("Error querying the database");}
            console.log("Records returned from DB:", result.recordset);
            res.json(result.recordset);
    });
});
app.post('/Username', (req, res) => {
    const { username, password } = req.body;
    const request = 'Insert into HospitalStaff'('${Username}','${Password}');
    const request = new sql.Request();
    request.query(query, (err)=> {
        if(err)res.status(500).send(err);
        else res.send("Staff memeber added successfully");
    });
});

app.put('/Username/:id', (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    const query = `UPDATE HospitalStaff SET Username='${username}', Password='${password}' WHERE ID=${id}`;
    const request = new sql.Request();
    request.query(query, (err) => {
        if (err) res.status(500).send(err);
        else res.send("Staff member updated successfully");
    });
});
app.delete('/Username/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM HospitalStaff WHERE ID=${id}`;
    const request = new sql.Request();
    request.query(query, (err) => {
        if (err) res.status(500).send(err);
        else res.send("Staff member deleted successfully");
    });
});
