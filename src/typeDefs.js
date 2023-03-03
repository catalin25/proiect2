const { gql } = require('apollo-server')

const typeDefs = gql`

  type Student {
    id: ID!
    email: String!
    fullName: String!
    dept: String
    enrolled: Boolean
  }

  type User{
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput{
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    enrollment: [Student!]
    students: [Student!]!
    student(id: ID!): Student
  }
  type AuthPayload {
    user: User!
    token: String!
  }

  type Mutation {
    registerStudent(email: String!, fullName: String!, dept: String): Student!
    enroll(id: ID!): Student
    register(username: String!,email: String!,password: String!,confirmPassword: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`
module.exports = {
  typeDefs,
}