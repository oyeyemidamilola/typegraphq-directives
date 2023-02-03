
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { DirectiveLocation, GraphQLDirective, GraphQLSchema } from 'graphql';
import { defaultFieldResolver } from 'graphql';

export const UppercaseDirective = new GraphQLDirective({
    name: 'uppercase',
    description: 'Provides default value for input field.',
    locations: [DirectiveLocation.FIELD],
    isRepeatable: true
});


export function upperDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {
    return mapSchema(schema, {
      // Executes once for each object field in the schema
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        // Check whether this field has the specified directive
        const upperDirective =  getDirective(schema, fieldConfig, directiveName)?.[0];
        if (upperDirective) {
          // Get this field's original resolver
          const { resolve = defaultFieldResolver } = fieldConfig;
  
          // Replace the original resolver with a function that *first* calls
          // the original resolver, then converts its result to upper case
          fieldConfig.resolve = async function (source, args, context, info) {
            const result = await resolve(source, args, context, info);
            if (typeof result === 'string') {
              return result.toUpperCase();
            }
            return result;
          };
          return fieldConfig;
        }
      },
    });
  }