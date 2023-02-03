import { Query, Resolver } from "type-graphql";

import { Recipe } from "../types/recipe";



@Resolver()
export class RecipeResolver {

    @Query(() => Recipe)
    getRecipe(): Recipe {
        return {
            id: "1",
            name: "Recipe 1",
            description: "Recipe Description",
            createdAt: new Date().toUTCString(),
            ingredients: ["ingredient 1", "ingredient 2"]
        }
    } 
}