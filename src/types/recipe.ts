import { Directive, Field, ObjectType } from "type-graphql"


@ObjectType()
export class Recipe {

    @Field()
    id!: string

    @Field()
    @Directive("@uppercase")
    name!: string

    @Field()
    description!: string

    @Field(of => [String])
    ingredients!: string[]

    @Directive(`@date(format: "YYYY/MM/DD")`)
    @Field()
    createdAt!: string
}