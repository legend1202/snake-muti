
var db = require('../db');
var tournament = require('../models/tournament');
var TournamentCtrl = require('../controllers/tournamentController');
var database = null;

exports.initdatabase = function () {
    db.connect(function (err) {
        if (err) {
            console.log(err);
            console.log('Unable to connect to Mongo.');
            process.exit(1);
        }
        console.log('Connected to the DB.');
        database = db.get();
        tournament.initdatabase(database);
        TournamentCtrl.getTournaments();
    });
};

exports.initsocket = async function (socket, io) {

    TournamentCtrl.setSocket(io);

    // Handle new player joining a tournament
    socket.on('new player', (playerData) => {
        TournamentCtrl.joinRoom(socket, playerData);
    });

    socket.on('delete player', (playerData) => {
        TournamentCtrl.deletePlayer(playerData);
    });

    socket.on('move player', (res) => {
        if (!!!res.playerId) {
            
        }else{
            TournamentCtrl.movePlayer(socket, res);
        }
    });

    socket.on('rotate player', (res) => {
        TournamentCtrl.rotatePlayer(socket, res);
    });

    socket.on('destroy food', (res) => {
        TournamentCtrl.deleteFood(res);
    });

    socket.on('generate food', (res) => {
        TournamentCtrl.generateFood(res);
    });

    socket.on('errorMessage', (res) => {
        console.log('Socket error!' + res);
    });

    // Handle player disconnect
    socket.on('disconnect', async function (res) {
        console.log('One of users is disconnected', res);
    });
}