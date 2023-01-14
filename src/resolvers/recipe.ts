import { Context } from "@interfaces/context";
import { Ctx, Query, Resolver } from "type-graphql";



@Resolver()
export class RecipeResolver {

    @Query(() => String)
    testQuery(@Ctx() context: Context): string {
        return "Successfully queried"
    } 
}