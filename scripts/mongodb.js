docker ps
docker exec -it a9147850fc8e mongo -u doug -p 123 --authenticationDatabase herois

// databases
show dbs

// mudando o conexto para uma database
use herois

// mostrar tabelas(colecoes)
show collections

db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

db.herois.find()
db.herois.find().pretty()


for(let i=0; i<=100; i++){
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })
}


db.herois.count()
db.herois.findOne()
db.herois.findOne()
db.herois.find().limit(50).sort({nome: -1})
db.find({}, {poder: 1, _id: 0})

// create
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

// read
db.herois.find()

// update
db.herois.update({_id: ObjectId('632863c9439af0fce1947d36')}, { nome: 'Mulher Maravilha'})

// $set - atualiza somente aquele campo e nao apaga os demais
db.herois.update({_id: ObjectId('634d4e23b5d6e1f36679f5ff')}, { $set: {nome: 'Lanterna Verde'}} )

// delete
db.herois.remove({nome: 'Clone-1'})

