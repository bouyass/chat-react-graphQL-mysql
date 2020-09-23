const { User } = require('../models')
const user = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env.json')
const { Op } = require('sequelize')

const { UserInputError, AuthenticationError } = require('apollo-server') 

module.exports = {
Query: {
    getUsers: async (_,__,context) => {
        let user
        if(context.req && context.req.headers.authorization){
            const token = context.req.headers.authorization.split(" ")[1]
            jwt.verify(token, JWT_SECRET,(err, decodedToken) => {
                if(err){
                    throw new AuthenticationError('Unanthenticated')
                }
                user = decodedToken
            });
        }

        const users = await User.findAll({where: {username: {[Op.ne]: user.username}}})

        return users
    },
    login: async (_, args) => {
        let errors = {}
        const { username, password } = args

        try{
            
            // check if the username exist 
            const user = await User.findOne({where: {username}})
            if(!user){
                errors.username = 'user not found'
                throw errors
            }

            // check if the password is valid 
            const correctPassword = await bcrypt.compare(password, user.password)
            if(!correctPassword){
                errors.password = 'password provided is wrong'
            }


            if(Object.keys(errors).length > 0){
                throw errors
            }

            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h'}) 


            return {

                ...user.toJSON(),
                createdAt: user.createdAt.toISOString(),
                token
            }
 
        }catch(err){
            console.log(err)
            throw new UserInputError('Authentication failed', {errors: err})
        }
        
    }
  },
  Mutation: {
      register: async (_, args) => {
            let { username, email, password, confirmPassword } =  args
            let errors = {}
            try{
                // TODO: validate input data 

                if(username.trim() === '') errors.username = "username must not be empty"
                if(email.trim() === '') errors.email = "email must not be empty"
                if(password.trim() === '') errors.password = "password must not be empty"
                if(confirmPassword.trim() === '') errors.confirmPassword = "confirmation password must not be empty"

                // chack if username / email exists 

                const userName = await User.findOne({where : {username}})
                const emailConf = await User.findOne({where : {email}})

                if(userName) errors.username = 'username already taken'
                if(emailConf) errors.email = 'email already taken'

                // check if the email is valid
                if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) errors.email = 'email is not valid'

                // check if the passwords are identical
                if(password !== confirmPassword) errors.password = ' password are not identical'
        
                // check if the errors object contains at least one key meaning one value (error)
                if(Object.keys(errors).length > 0){
                    throw errors
                }

                // TODO: hash the password
                password = await bcrypt.hash(password, 6)

                // create the user 
                const user = await User.create({
                    username, email, password
                })

                return user
                
            }catch(err){
                throw new UserInputError('bad input', {errors: err})
            }
      }
  }
}