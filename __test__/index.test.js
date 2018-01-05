const root = process.env.SERVER_URL || 'http://127.0.0.1:8080'
const fetch = require("node-fetch")
const chatRoot = root+'/api/chat'

/*
npm install --save-dev jest
npm install node-fetch --save

"jest": {
  "verbose": true,
  "collectCoverage": true
},

*/

//ROTTE e metodi utili
//POST /user per registrarsi


const postUser = function (newUser) {
    var postUserPath = chatRoot + "/user";
    return fetch(postUserPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
}

const example_new_user=  {
    "uid": "lb1",
    "user_name": "luca",
    "user_sur": "boffo",
    "psw": "lucaboffo1"
}

test('postUser', () => {
    return postUser(example_new_user)
        .then(postResponse => {return postResponse.json()})
        .then(postResponseJson => {
            expect(postResponseJson.uid).toEqual(example_new_user.uid)
          });
});

//GET /user/x per i dettagli dell'utente
const getOneUser = function (userID) {
    var getOneUserPath = chatRoot + "/user/" + userID;
    return fetch(getOneUserPath, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    })
}

test('getOneUser', () => {
    var uid = "5a4cec6f22245b0546f3d01d"; //findById
    return getOneUser(uid)
        .then(getOneResponse => {return getOneResponse.json()})
        .then(getOneResponseJson => {
            expect(getOneResponseJson._id).toEqual(uid)
          });
});


//PUT /user/x per aggiornare l'utente
const putUserPar = function (userID, modUser) {
    var putUserPath = chatRoot + "/user/" + userID;
    return fetch(putUserPath, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(modUser)
    })
}

const example_put_user_par=  {
    "user_name": "stefi", //passo solo un parametro, gli altri per come definita api restano invariati
}

test('putUserPar', ()=>{
  var userID = "5a4cf2499b24d50564fe00b5"; //findById Stefano

  return putUserPar(userID, example_put_user_par)
      .then(putResponse => {return putResponse.json()})
      .then(putResponseJson => {
          return getOneUser(userID);
      })
      .then(getResponse => {return getResponse.json()})
      .then(getResponseJson => {
          expect(getResponseJson.user_name).toEqual(example_put_user_par.user_name)})
      //.catch(e => {console.log(e)})

});

//PUT /user per aggiornare l'utente
const putUser = function (modUser) {
    var putUserPath = chatRoot + "/user";
    return fetch(putUserPath, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(modUser)
    })
}

const example_put_user=  {
    "uid" : "sb1",
    "user_name": "stefano"
}

test('putUser', ()=>{
  return putUser(example_put_user)
      .then(putResponse => {return putResponse.json()})
      .then(putResponseJson => {
          return getOneUser(putResponseJson._id);
      })
      .then(getResponse => {return getResponse.json()})
      .then(getResponseJson => {
          expect(getResponseJson.user_name).toEqual(example_put_user.user_name)})
      //.catch(e => {console.log(e)})

});

//POST /room per creare una stanza
const postRoom = function (newRoom) {
    var postRoomPath = chatRoot + "/room";
    return fetch(postRoomPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newRoom)
    })
}

const example_new_room=  {
    "rid": "r_id8",
    "room_name": "room_8",

}

test('postRoom', () => {
    return postRoom(example_new_room)
        .then(postResponse => {return postResponse.json()})
        .then(postResponseJson => {
            expect(postResponseJson.rid).toEqual(example_new_room.rid)
          });
});


//PUT /room per aggiornate il nome di una stanza
const putRoom = function (modRoom) {
    var putRoomPath = chatRoot + "/room";
    return fetch(putRoomPath, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(modRoom)
    })
}

const example_put_room=  {
    "rid" : "r_id5", //passo anche l'uid perchè fatta con il findOne e non findById
    "room_name": "room_5.1"
}

test('putRoom', ()=>{
  return putRoom(example_put_room)
      .then(putResponse => {return putResponse.json()})
      .then(putResponseJson => {
          expect(putResponseJson.room_name).toEqual(example_put_room.room_name)})
      });



//GET /rooms per una lista delle stanze
const getRooms = function () {
    var getRoomsPath = chatRoot + "/rooms";
    return fetch(getRoomsPath, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    })
}

test('getRooms', () => {
    return getRooms()
        .then(getRoomsResponse => {return getRoomsResponse.json()})
        .then(getRoomsResponseJson => {
            expect(getRoomsResponseJson[0].rid).toEqual("r_id1")
            expect(getRoomsResponseJson[1].rid).toEqual("r_id2")
            expect(getRoomsResponseJson[2].rid).toEqual("r_id3")
            expect(getRoomsResponseJson[3].rid).toEqual("r_id4")
            expect(getRoomsResponseJson[4].rid).toEqual("r_id5")
          }) /*Bisognerebbe controllarle tutte, ma in questo caso è dura senza un delete sulle room
          visto che ogni volta che eseguiamo il test carica una stanza*/
});


//GET /msg?room=x&time=x per tutti i messaggi nella stanza specificata, dalla data speificata
const getMsg = function (roomP, timeP) {
    var getMsgPath = chatRoot + "/msg?room=" + roomP + "&time=" + timeP;
    return fetch(getMsgPath, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    })
}


test('getMsg', () => {
    var roomP = "5a4cf659bd78d3058c80e8cd";
    var timeP = "2018-1-3";

    return getMsg(roomP, timeP)
        .then(getMsgResponse => {return getMsgResponse.json()})
        .then(getMsgResponseJson => {
            expect(getMsgResponseJson[0]._id).toEqual("5a4d07fd85656f062d230787")
            expect(getMsgResponseJson[1]._id).toEqual("5a4d080c85656f062d230788")
            expect(getMsgResponseJson[2]._id).toEqual("5a4d0ddb72d55506670e91f4")
          })
});



//POST /msg per scrivere un messaggio
const postMsg = function (newMsg) {
    var postMsgPath = chatRoot + "/msg";
    return fetch(postMsgPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newMsg)
    })
}

const example_new_msg=  {
    "content": "Oggi sono ammalato",
    "uid": "5a4cf2499b24d50564fe00b5",
    "rid": "5a4cf95c98b34b05be2890bd"

}

test('postMsg', () => {
    return postMsg(example_new_msg)
        .then(postResponse => {return postResponse.json()})
        .then(postResponseJson => {
            expect(postResponseJson.rid).toEqual(example_new_msg.rid)
          });
});

/*DELETE aggiuntiva*/
const deleteUser = function (userID) {
    var deleteUserPath = chatRoot + "/user/" + userID;
    return fetch(deleteUserPath, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }//,
    })
}


test('deleteUser', () => {
    /*return deleteAssignments(exampleAssignment_post_delete.assignmentID)
    .then(deleteResponse => {console.log(deleteResponse.status); return deleteResponse.json()})
    .then(deleteResponseJson => {

        expect(deleteResponseJson.message).toEqual("Successfully deleted")
      });*/
      var uid =  "lb1";
      return deleteUser(uid)
      .then(deleteResponse => {expect(deleteResponse.status).toBe(200)})
});

const deleteRoom = function (roomID) {
    var deleteRoomPath = chatRoot + "/room/" + roomID;
    return fetch(deleteRoomPath, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }//,
    })
}


test('deleteRoom', () => {
    /*return deleteAssignments(exampleAssignment_post_delete.assignmentID)
    .then(deleteResponse => {console.log(deleteResponse.status); return deleteResponse.json()})
    .then(deleteResponseJson => {

        expect(deleteResponseJson.message).toEqual("Successfully deleted")
      });*/
      var rid =  "r_id8";
      return deleteRoom(rid)
      .then(deleteResponse => {expect(deleteResponse.status).toBe(200)})
});
