const { gql } = require('apollo-server')

const typeDefs = gql`

type Query {
  enrollment: [Student!]!
  students: [Student!]!
  student(id: ID!): Student
}

type Mutation {
  registerStudent(email: String!, fullName: String!, dept: String!): Student!
  enroll(id: ID!): Student!
  register(username: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
}

type Student {
  id: ID!
  email: String!
  fullName: String!
  dept: String!
  enrolled: Boolean!
}

type User {
  id: ID!
  email: String!
  username: String!
}

type AuthPayload {
  user: User!
  token: String!
}
`
module.exports = {
  typeDefs,
}