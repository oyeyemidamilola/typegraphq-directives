import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { DirectiveLocation, GraphQLDirective, GraphQLSchema, GraphQLString } from 'graphql';
import { defaultFieldResolver } from 'graphql';
import { format as dateFormat} from 'date-and-time'

export const DateDirective = new GraphQLDirective({
    name: 'date',
    description: 'Transforms date fields based on inputed formats',
    locations: [DirectiveLocation.FIELD], 
    args: { 
        format: {
            type: GraphQLString,
            description: 'Format style',
            defaultValue: "YYYY/MM/DD HH:mm:ss"
         },
    }
});


export function dateDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD](fieldConfig) {
            const dateDirective = getDirective(schema, fieldConfig, directiveName)?.[0]
            if (dateDirective) {
              const { resolve = defaultFieldResolver } = fieldConfig
              const { format } = dateDirective
              fieldConfig.resolve = async (source, args, context, info) => {
                const date = await resolve(source, args, context, info)
                console.log(dateFormat(date, format, true))
                return date//dateFormat(new Date(date), format, true)
              }
              console.log(fieldConfig)
              return fieldConfig
            }
        }
    })
}