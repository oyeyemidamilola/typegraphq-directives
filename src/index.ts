import 'reflect-metadata'
import path from 'path'
import http from 'http'
import express from "express";
import cors from 'cors'
import { json } from 'body-parser'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'
import { GraphQLSchema } from 'graphql';
import { buildSchemaSync } from 'type-graphql';

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { Context } from '@interfaces/context';

import { DateDirective, dateDirectiveTransformer, UppercaseDirective, upperDirectiveTransformer } from './directives';



const buildContext = (contextRequest: express.Request, contextResponse: express.Response): Context => {

    return {
        request: contextRequest,
        response: contextResponse
    }
}


function createSchemaSync(): GraphQLSchema {
    let schema =  buildSchemaSync({
        resolvers:[path.join(__dirname, 'resolvers/**/*.ts')],
        directives: [ UppercaseDirective, DateDirective ],
        emitSchemaFile: true
    })
    schema = upperDirectiveTransformer(schema, 'uppercase');
    schema = dateDirectiveTransformer(schema, 'date');
    return schema
}


const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer<Context>({
    schema: createSchemaSync(),
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer })
    ]
})


async function startServer(){
    
    await server.start()

    app.use('/graphql', cors(), json(), expressMiddleware(server, {
        context: async ({ req, res }) => buildContext(req, res)
    }))


    await new Promise(resolve => {
        httpServer.listen({ port: 3034 })
        console.log(`🚀 Server ready at http://localhost:3034/graphql`)
    })
}

startServer()

