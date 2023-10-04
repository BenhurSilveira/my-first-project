const express = require('express')
const uuid = require('uuid')

const port = 3000

const app = express()
app.use(express.json())

/* 
    - Query params => meusite.com/users?nome=benhur&age=34 // FILTROS
    - Route params => /users/2  // BUSCAR, DELETAR ou ATUALIZAR ALGO ESPECIFICO
    - Request Body => {"name": "Benhur", "age":}


    - GET          => BUSCAR INFORMACAO NO BACK-END
    - POST         => CRIAR INFORMACAO NO BACK-END
    - PUT / PATCH  => ALTERAR/ATUALIZAR INFORMACAO NO BACK-END
    - DELETE       => DELETAR INFORMACAO NO BACK-END

    -Middleware => INTERCEPTADOR => tem o poder de parar ou alterar dados da requisicao
    
    const name = request.query.name
    const age = request.query.age
    const { name, age } = request.query
    return response.json({name, age })

   
    const { name, age} = request.body
    return response.json({ name, age})

    
    app.get('/users/:id', (request, response) => {})
    const { id } = request.params para parametros
    console.log(id)
    const { name, age } = request.query // destructuring assignment economiza codigo
   
*/

const users = [] // essa variavel nao se usa, foi so para metodo didatico

const checkUserId = (request, response, next) => {
    const { id } = request.params
    
    const index = users.findIndex( user => user.id === id)

    if(index < 0){
        return response.status(404).json({error: "User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()

}

app.get('/users', (request, response) => { 

    return response.json(users)  
})

app.post('/users', (request, response) => { 
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age}

    users.push(user)

    return response.status(201).json(user)  
})

app.put('/users/:id', checkUserId, (request, response) => { 
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age }

    users[index] = updateUser

    return response.json(updateUser)  
})

app.delete('/users/:id', checkUserId, (request, response) => { 
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()  
})

app.listen(port, () =>{
    console.log(`🚀Server started on port ${port}`)
})