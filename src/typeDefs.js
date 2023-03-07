const { gql } = require('apollo-server')

const typeDefs = gql`

  type Query {
  enrollment: [Student!]!
  students: [Student!]!
  student(id: Int!): Student
}

type Mutation {
  registerStudent(email: String!, fullName: String!, dept: String!): Student
  enroll(id: Int!): Student
  register(username: String!, email: String!, password: String!, confirmPassword: String!): AuthPayload
  login(email: String!, password: String!): AuthPayload
}

type Student {
  id: Int!
  email: String!
  fullName: String!
  dept: String!
  enrolled: Boolean!
}

type User {
  id: Int!
  email: String!
  username: String!
  createdAt: String!
}

type AuthPayload {
  user: User!
  token: String!
}

`
module.exports = {
  typeDefs,
}