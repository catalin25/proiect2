const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const APP_SECRET = "my secret password";

const Student = {
  id: (parent, args, context, info) => parent.id,
  email: (parent) => parent.email,
  fullName: (parent) => parent.fullName,
  dept: (parent) => parent.dept,
  enrolled: (parent) => parent.enrolled,
};

const Query = {
  enrollment: (parent, args) => {
    return prisma.student.findMany({
      where: { enrolled: true },
    });
  },
  students: (parent, args) => {
    return prisma.student.findMany({});
  },
  student: (parent, args) => {
    return prisma.student.findFirst({
      where: { id: Number(args.id) },
    });
  },
};

const Mutation = {
  registerStudent: (parent, args) => {
    return prisma.student.create({
      data: {
        email: args.email,
        fullName: args.fullName,
        dept: args.dept,
      },
    });
  },
  enroll: (parent, args) => {
    return prisma.student.update({
      where: { id: Number(args.id) },
      data: {
        enrolled: true,
      },
    });
  },
  register: async (parent, { username, email, password }, context) => {
    console.log("Received registration request: ", { username, email, password });
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed: ", hashedPassword);
    const user = await context.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });
    console.log("User created: ", user);
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    console.log("Token generated: ", token);
    return {
      user,
      token,
    };
  },
  login: async (parent, { email, password }, context) => {
    const user = await context.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error('No user found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return {
      user,
      token,
    };
  },
};

const resolvers = { Student, Query, Mutation };

module.exports = {
  resolvers,
}; 