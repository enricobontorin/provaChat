# provaChat
Prova_chat_pre_esame

CHAT - BACK END - Sviluppare un back end per una chat in node.js. Prevedere la possiblità di avere più stanze. Prevedere o meno un meccanismo di autenticazione. Definire le seguenti api:

POST /user per registrarsi
GET /user/x per i dettagli dell'utente
PUT /user o /user/x per aggiornare l'utente
POST /room per creare una stanza
PUT /room per aggiornate il nome di una stanza
GET /rooms per una lista delle stanze
GET /msg?room=x?time=x per tutti i messaggi nella stanza specificata, dalla data speificata
POST /msg per scrivere un messaggio
