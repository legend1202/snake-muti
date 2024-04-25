var database = null;
exports.initdatabase = function (db) {
    database = db;
};

exports.getTournaments = function (callback) {
    var collection = database.collection('tournaments_tbl');
    collection.find().toArray(function (err, rows) {
        callback(rows);
    });
};