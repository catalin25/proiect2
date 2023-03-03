const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const APP_SECRET = 'myappsecret';

function getUserId(context) {
  const Authorization = context.req.headers['authorization'];
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error('Not authenticated');
}

const resolvers = {
  Query: {
    enrollment: async (parent, args, context) => {
      const students = await context.prisma.student.findMany();
      return students.filter((student) => student.enrolled === true);
    },
    students: async (parent, args, context) => {
      const students = await context.prisma.student.findMany();
      return students;
    },
    student: async (parent, { id }, context) => {
      const student = await context.prisma.student.findOne({
        where: {
          id: parseInt(id),
        },
      });
      return student;
    },
  },
  Mutation: {
    registerStudent: async (parent, { email, fullName, dept }, context) => {
      const student = await context.prisma.student.create({
        data: {
          email,
          fullName,
          dept,
          enrolled: false,
        },
      });
      return student;
    },
    enroll: async (parent, { id }, context) => {
      const userId = getUserId(context);
      const student = await context.prisma.student.findOne({
        where: {
          id: parseInt(id),
        },
      });
      if (!student) {
        throw new Error('No student found');
      }
      const updatedStudent = await context.prisma.student.update({
        where: {
          id: parseInt(id),
        },
        data: {
          enrolled: true,
        },
      });
      return updatedStudent;
    },
    register: async (parent, { username, email, password, confirmPassword }, context) => {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await context.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      });
      if (!user) {
        throw new Error('User could not be created');
      }
      const token = jwt.sign({ userId: user.id }, APP_SECRET);
      return {
        user,
        token,
      };
    },
    login: async (parent, { email, password }, context) => {
      const user = await context.prisma.user.findOne({
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
  },
};
module.exports = resolvers;